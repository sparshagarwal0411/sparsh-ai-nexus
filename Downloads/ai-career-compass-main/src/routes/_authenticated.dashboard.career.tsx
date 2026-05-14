import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Compass, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLatestResume } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/dashboard/career")({ component: CareerPage });

function CareerPage() {
  const fetchResume = useServerFn(getLatestResume);
  const { data: resume } = useQuery({ queryKey: ["resume"], queryFn: () => fetchResume() });
  const suggestions = (resume?.career_suggestions as any[]) ?? [];

  if (!resume) return (
    <div className="grid h-64 place-items-center text-center">
      <div>
        <p className="text-muted-foreground">Upload a resume to get AI career suggestions.</p>
        <Button asChild className="mt-4 bg-gradient-primary"><Link to="/dashboard">Get started</Link></Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold">Career suggestions</h1>
        <p className="mt-1 text-muted-foreground">AI-mapped paths based on your skills, projects, and interests.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {suggestions.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Compass className="size-5" /></div>
            <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.why}</p>
            <ul className="mt-4 space-y-1.5">
              {(s.next_steps as string[]).map((step) => (
                <li key={step} className="flex items-start gap-2 text-sm">
                  <ChevronRight className="mt-0.5 size-4 shrink-0 text-primary" /> {step}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
