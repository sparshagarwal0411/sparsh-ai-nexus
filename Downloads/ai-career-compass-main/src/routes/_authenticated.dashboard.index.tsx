import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Upload, FileText, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { extractResume, getLatestResume } from "@/lib/ai.functions";
import { extractPdfText } from "@/lib/pdf";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/")({ component: DashboardHome });

function DashboardHome() {
  const fetchLatest = useServerFn(getLatestResume);
  const extract = useServerFn(extractResume);
  const navigate = useNavigate();
  const { data: resume, isLoading, refetch } = useQuery({ queryKey: ["resume"], queryFn: () => fetchLatest() });
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setBusy(true);
    try {
      if (f.type === "application/pdf") setText(await extractPdfText(f));
      else setText(await f.text());
      toast.success("Resume loaded — review then analyze");
    } catch (e: any) { toast.error(e.message || "Failed to read file"); }
    finally { setBusy(false); }
  };

  const analyze = async () => {
    if (text.trim().length < 50) return toast.error("Resume text is too short");
    setBusy(true);
    try {
      await extract({ data: { resumeText: text } });
      toast.success("Resume analyzed!");
      await refetch();
      navigate({ to: "/dashboard/matches" });
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  if (isLoading) return <div className="grid h-64 place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold">Hi 👋 Let's find your fit.</h1>
        <p className="mt-2 text-muted-foreground">Upload your resume — AI does the rest in seconds.</p>
      </motion.div>

      {resume ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <div className="flex items-center gap-2 text-sm text-primary"><Sparkles className="size-4" /> Latest analysis</div>
          <p className="mt-2 text-foreground/90">{resume.summary}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Stat label="Skills" value={(resume.skills as any[])?.length ?? 0} />
            <Stat label="Projects" value={(resume.projects as any[])?.length ?? 0} />
            <Stat label="Career paths" value={(resume.career_suggestions as any[])?.length ?? 0} />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {(resume.skills as string[] ?? []).slice(0, 12).map((s) => (
              <span key={s} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs">{s}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild className="bg-gradient-primary"><Link to="/dashboard/matches">See matches <ArrowRight className="ml-1 size-4" /></Link></Button>
            <Button asChild variant="outline"><Link to="/dashboard/career">Career suggestions</Link></Button>
            <Button variant="ghost" onClick={() => { setText(""); }}>Re-upload</Button>
          </div>
        </motion.div>
      ) : null}

      <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
        <h2 className="font-display text-2xl font-semibold">{resume ? "Update your resume" : "Upload your resume"}</h2>
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 p-8 text-center transition hover:bg-secondary">
          <Upload className="size-6 text-primary" />
          <span className="font-medium">Drop a PDF or click to upload</span>
          <span className="text-xs text-muted-foreground">PDF, TXT — up to ~5 pages works best</span>
          <input type="file" className="hidden" accept=".pdf,.txt" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        </label>
        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground"><FileText className="size-3" /> Or paste resume text</p>
          <Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your resume text here…" />
        </div>
        <Button onClick={analyze} disabled={busy || text.trim().length < 50} className="mt-4 bg-gradient-primary">
          {busy ? <><Loader2 className="mr-2 size-4 animate-spin" /> Analyzing…</> : <>Analyze with AI <Sparkles className="ml-1 size-4" /></>}
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/40 p-4">
      <div className="font-display text-3xl font-bold text-gradient">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
