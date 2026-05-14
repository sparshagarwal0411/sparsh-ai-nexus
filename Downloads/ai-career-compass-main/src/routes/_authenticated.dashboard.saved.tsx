import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listSaved, unsaveInternship } from "@/lib/ai.functions";
import { InternshipCard } from "@/components/internship-card";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/saved")({ component: SavedPage });

function SavedPage() {
  const fetchSaved = useServerFn(listSaved);
  const unsave = useServerFn(unsaveInternship);
  const { data, refetch, isLoading } = useQuery({ queryKey: ["saved"], queryFn: () => fetchSaved() });

  const remove = async (id: string) => {
    await unsave({ data: { internship_id: id } });
    toast.success("Removed");
    refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold">Saved internships</h1>
        <p className="mt-1 text-muted-foreground">{data?.length ?? 0} bookmarked roles</p>
      </div>
      {!isLoading && (data?.length ?? 0) === 0 && (
        <div className="grid place-items-center rounded-3xl border border-dashed border-border p-16 text-center">
          <Bookmark className="size-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Nothing saved yet.</p>
          <Button asChild className="mt-4 bg-gradient-primary"><Link to="/dashboard/matches">Browse matches</Link></Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data ?? []).map((row: any, i: number) => (
          <InternshipCard
            key={row.id} index={i}
            internship={row.internship_data}
            match={row.match_score ? { id: row.internship_id, match_score: row.match_score, eligibility: "moderate", selection_chance: "medium", explanation: "From your saved list", matched_skills: [], missing_skills: [], nearly_qualified: false } : undefined}
            saved
            onToggleSave={() => remove(row.internship_id)}
          />
        ))}
      </div>
    </div>
  );
}
