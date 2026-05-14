import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLatestResume, matchInternships, listSaved, saveInternship, unsaveInternship } from "@/lib/ai.functions";
import { INTERNSHIPS } from "@/lib/internships";
import { InternshipCard, type Match } from "@/components/internship-card";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/matches")({ component: MatchesPage });

function MatchesPage() {
  const fetchResume = useServerFn(getLatestResume);
  const fetchSaved = useServerFn(listSaved);
  const match = useServerFn(matchInternships);
  const save = useServerFn(saveInternship);
  const unsave = useServerFn(unsaveInternship);

  const { data: resume } = useQuery({ queryKey: ["resume"], queryFn: () => fetchResume() });
  const { data: saved, refetch: refetchSaved } = useQuery({ queryKey: ["saved"], queryFn: () => fetchSaved() });
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "strong" | "near">("all");

  useEffect(() => {
    if (!resume) return;
    setLoading(true);
    match({
      data: {
        resumeId: resume.id,
        internships: INTERNSHIPS.map((i) => ({
          id: i.id, title: i.title, company: i.company,
          requiredSkills: i.requiredSkills, niceToHave: i.niceToHave,
          description: i.description, tags: i.tags,
        })),
      },
    })
      .then((m) => setMatches(m.sort((a, b) => b.match_score - a.match_score)))
      .catch((e: any) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [resume?.id]); // eslint-disable-line

  const savedIds = useMemo(() => new Set((saved ?? []).map((s: any) => s.internship_id)), [saved]);

  const toggleSave = async (id: string, internship: any, score: number) => {
    if (savedIds.has(id)) { await unsave({ data: { internship_id: id } }); toast.success("Removed"); }
    else { await save({ data: { internship_id: id, internship_data: internship, match_score: score } }); toast.success("Saved"); }
    refetchSaved();
  };

  if (!resume) return (
    <div className="grid h-64 place-items-center text-center">
      <div>
        <p className="text-muted-foreground">Upload your resume first to see matches.</p>
        <Button asChild className="mt-4 bg-gradient-primary"><Link to="/dashboard">Go to upload</Link></Button>
      </div>
    </div>
  );

  const visible = INTERNSHIPS.filter((i) => {
    const m = matches?.find((x) => x.id === i.id);
    if (!m) return true;
    if (filter === "strong") return m.match_score >= 70;
    if (filter === "near") return m.nearly_qualified;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-bold">Your matches</h1>
          <p className="mt-1 text-muted-foreground">{matches ? `${matches.length} internships ranked by AI` : "Calculating fit…"}</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
          <Filter className="ml-2 size-3.5 text-muted-foreground" />
          {(["all", "strong", "near"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${filter === f ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {f === "near" ? "Almost there" : f}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          <Sparkles className="size-4 animate-pulse text-primary" />
          AI is matching you to internships across Internshala, LinkedIn, Indeed, Prosple, Wellfound…
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((i, idx) => {
          const m = matches?.find((x) => x.id === i.id);
          return (
            <InternshipCard
              key={i.id} internship={i} match={m} index={idx}
              saved={savedIds.has(i.id)}
              onToggleSave={() => toggleSave(i.id, i, m?.match_score ?? 0)}
            />
          );
        })}
      </div>
      {!loading && matches === null && <div className="grid h-32 place-items-center"><Loader2 className="size-5 animate-spin" /></div>}
    </div>
  );
}
