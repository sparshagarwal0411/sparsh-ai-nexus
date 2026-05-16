import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

export default function ScrollNav() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center gap-6">
      {/* Progress Line */}
      <div className="relative w-[2px] h-64 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full bg-primary origin-top"
          style={{ scaleY }}
        />
      </div>

      {/* Section Dots */}
      <div className="flex flex-col gap-4">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group relative flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <motion.div
              animate={{
                scale: activeSection === s.id ? 1.5 : 1,
                backgroundColor: activeSection === s.id ? "hsl(var(--primary))" : "rgba(255,255,255,0.2)"
              }}
              className="w-2 h-2 rounded-full transition-colors"
            />
            
            {/* Label on Hover */}
            <span className="absolute right-6 px-2 py-1 rounded bg-black/80 text-[10px] text-white font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
              {s.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
