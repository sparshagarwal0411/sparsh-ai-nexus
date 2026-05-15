import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import TechStackScene from "./TechStackScene";
import { lazy, Suspense } from "react";

const categories = [
  {
    label: "Languages",
    skills: ["Python", "C++", "SQL", "TypeScript"],
  },
  {
    label: "AI / ML",
    skills: ["TensorFlow", "Pandas", "NumPy", "ML", "NLP"],
  },
  {
    label: "Web & Frameworks",
    skills: ["React", "Flask", "Tailwind CSS"],
  },
  {
    label: "Backend & DB",
    skills: ["Supabase", "Firebase"],
  },
  {
    label: "CS Fundamentals",
    skills: ["DSA", "OOP", "DBMS"],
  },
];

export default function SkillsSection() {
  return (
    <SectionWrapper id="skills" title="Tech Stack" subtitle="Tools and technologies I work with">
      <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">

        {/* Left Column: Skills List */}
        <div className="space-y-8">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ delay: ci * 0.1, type: "spring", stiffness: 50 }}
            >
              <h3 className="text-sm font-mono text-primary mb-3 tracking-wide uppercase">
                {cat.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((s, si) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: ci * 0.1 + si * 0.05, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.08 }}
                    className="px-4 py-2 rounded-lg glass neon-border text-sm font-medium text-foreground cursor-default hover:neon-glow-box transition-all duration-300"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column: 3D Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="h-[400px] w-full bg-black rounded-xl overflow-hidden neon-border relative"
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none w-full text-center">
            <p className="inline-block text-xs md:text-sm text-cyan-400/80 font-mono tracking-wider animate-pulse bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-cyan-900/30">
              Calculated Chaos • Drag to Explore
            </p>
          </div>
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading 3D...</div>}>
            <TechStackScene />
          </Suspense>
        </motion.div>

      </div>
    </SectionWrapper>
  );
}
