import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Upload, Brain, Target, Bookmark, Zap, ArrowRight, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({ component: Landing });

const platforms = ["Internshala", "LinkedIn", "Indeed", "Prosple", "Wellfound"];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <Navbar />

      <main className="relative">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="size-3 text-primary" /> AI-powered internship matching for students
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
              Land the internship<br />
              <span className="text-gradient">your resume actually fits.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Upload your resume. Our AI reads your skills, projects, and interests — then ranks internships from Internshala, LinkedIn, Indeed, Prosple and more with honest match scores and missing-skill insights.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/signup">Upload your resume <ArrowRight className="ml-1 size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#how">See how it works</a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span>Aggregating opportunities from</span>
              {platforms.map((p) => <span key={p} className="font-medium text-foreground/80">{p}</span>)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border/50 shadow-elevated">
              <img src={heroImg} alt="Internly AI matcher" width={1600} height={1200} className="aspect-[16/10] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            </div>
          </motion.div>
        </section>

        {/* Bento features */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">Everything you need, <span className="text-gradient">in one dashboard.</span></h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Stop juggling 5 tabs. Start applying smarter.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
            <BentoCard className="md:col-span-2" icon={<Brain />} title="AI resume analysis" desc="Skills, projects, education, interests — extracted in seconds with structured AI parsing.">
              <div className="mt-4 flex flex-wrap gap-2">
                {["React", "Python", "ML", "Figma", "SQL", "TypeScript"].map((s, i) => (
                  <span key={s} style={{ animationDelay: `${i * 80}ms` }} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs">{s}</span>
                ))}
              </div>
            </BentoCard>
            <BentoCard icon={<Target />} title="Honest match scores" desc="0–100% based on real skill overlap and project fit. No fluff.">
              <div className="mt-6 grid place-items-center">
                <div className="relative grid size-28 place-items-center">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="87 100" strokeLinecap="round" />
                  </svg>
                  <span className="font-display text-3xl font-bold">87<span className="text-base text-muted-foreground">%</span></span>
                </div>
              </div>
            </BentoCard>
            <BentoCard icon={<Zap />} title="Almost-there alerts" desc="See internships you'd qualify for with just 1–2 more skills.">
              <div className="mt-3 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-xs">
                <strong className="text-warning">+ Docker, + AWS</strong> would unlock 4 more roles.
              </div>
            </BentoCard>
            <BentoCard icon={<TrendingUp />} title="Career suggestions" desc="AI maps your profile to career paths — with concrete next steps." />
            <BentoCard icon={<Bookmark />} title="Save & track" desc="Bookmark roles, see them all in one place, apply when you're ready." />
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">Three steps to <span className="text-gradient">smarter applications.</span></h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { i: <Upload />, t: "Upload your resume", d: "Drag a PDF or paste your text. Takes 5 seconds." },
              { i: <FileText />, t: "AI extracts everything", d: "Skills, projects, education, interests — all structured automatically." },
              { i: <Target />, t: "See ranked matches", d: "Match scores, missing skills, apply links — across every major platform." },
            ].map((s, i) => (
              <motion.div key={s.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border/50 bg-card p-6 shadow-subtle hover:shadow-card transition-shadow">
                <div className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">{s.i}</div>
                <h3 className="mt-4 font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-10 text-center shadow-elevated">
            <div className="relative">
              <h2 className="font-display text-4xl font-bold sm:text-5xl">Ready to find your fit?</h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">Join students using AI to apply smarter, not harder.</p>
              <Button asChild size="lg" className="mt-6">
                <Link to="/signup">Get started — it's free <ArrowRight className="ml-1 size-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Internly · Built for students
        </footer>
      </main>
    </div>
  );
}

function BentoCard({ icon, title, desc, children, className = "" }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-subtle transition-all hover:-translate-y-0.5 hover:shadow-card ${className}`}>
      <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      {children}
    </motion.div>
  );
}
