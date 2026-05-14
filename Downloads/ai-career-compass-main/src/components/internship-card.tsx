import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, Clock, Wallet, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Internship } from "@/lib/internships";

export type Match = {
  id: string;
  match_score: number;
  eligibility: "strong" | "moderate" | "stretch";
  selection_chance: "high" | "medium" | "low";
  explanation: string;
  matched_skills: string[];
  missing_skills: string[];
  nearly_qualified: boolean;
};

export function InternshipCard({
  internship,
  match,
  saved,
  onToggleSave,
  index = 0,
}: {
  internship: Internship;
  match?: Match;
  saved?: boolean;
  onToggleSave?: () => void;
  index?: number;
}) {
  const score = match?.match_score ?? 0;
  const ringColor = score >= 75 ? "var(--success)" : score >= 50 ? "var(--primary)" : "var(--warning)";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
    >
      {match?.nearly_qualified && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning-foreground">
          <AlertCircle className="size-3.5 text-warning" />
          So close — missing only {match.missing_skills.length} skill{match.missing_skills.length > 1 ? "s" : ""}
        </div>
      )}

      <header className="flex items-start gap-3">
        <div className="grid size-12 place-items-center rounded-xl bg-secondary text-2xl">{internship.logo}</div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold leading-tight">{internship.title}</h3>
          <p className="truncate text-sm text-muted-foreground">
            {internship.company} · <span className="text-foreground/80">{internship.platform}</span>
          </p>
        </div>
        {match && (
          <div className="relative grid size-14 shrink-0 place-items-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={ringColor} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${score} 100`}
              />
            </svg>
            <span className="text-xs font-bold tabular-nums">{score}%</span>
          </div>
        )}
      </header>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{internship.location}{internship.remote ? " · Remote" : ""}</span>
        <span className="inline-flex items-center gap-1"><Clock className="size-3" />{internship.duration}</span>
        <span className="inline-flex items-center gap-1"><Wallet className="size-3" />{internship.stipend}</span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{internship.description}</p>

      {match && (
        <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
            <Sparkles className="size-3" /> AI insight
          </div>
          <p className="mt-1 text-sm text-foreground/90">{match.explanation}</p>
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span>Selection chance: <strong className="capitalize">{match.selection_chance}</strong></span>
            <span className="capitalize text-muted-foreground">{match.eligibility} fit</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(match?.matched_skills ?? internship.requiredSkills).slice(0, 5).map((s) => (
          <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>
        ))}
        {match?.missing_skills?.slice(0, 3).map((s) => (
          <Badge key={s} variant="outline" className="rounded-full border-warning/40 text-warning">+ {s}</Badge>
        ))}
      </div>

      <footer className="mt-4 flex items-center gap-2">
        <Button asChild size="sm" className="flex-1 bg-gradient-primary">
          <a href={internship.applyUrl} target="_blank" rel="noreferrer">
            Apply on {internship.platform} <ExternalLink className="ml-1 size-3.5" />
          </a>
        </Button>
        {onToggleSave && (
          <Button variant="outline" size="icon" onClick={onToggleSave} aria-label={saved ? "Unsave" : "Save"}>
            {saved ? <BookmarkCheck className="size-4 text-primary" /> : <Bookmark className="size-4" />}
          </Button>
        )}
      </footer>
    </motion.article>
  );
}
