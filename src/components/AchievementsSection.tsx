import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import DotMatrix from "./ui/DotMatrix";
import { Trophy, Zap, Award, Star, Crown, Medal } from "lucide-react";
import React, { useRef } from "react";

const achievements = [
  {
    icon: Trophy,
    title: "Hackathon Winner",
    desc: "Built award-winning civic tech solutions under 24-hour constraints.",
    color: "text-yellow-400"
  },
  {
    icon: Crown,
    title: "AI Project Lead",
    desc: "Led teams in developing ML-powered tools for social impact use cases.",
    color: "text-primary"
  },
  {
    icon: Medal,
    title: "Open Source",
    desc: "Active contributor to open-source projects in the AI/ML ecosystem.",
    color: "text-green-400"
  },
  {
    icon: Star,
    title: "Community Builder",
    desc: "Organized workshops and events to foster student developer communities.",
    color: "text-pink-400"
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
}

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position state
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation for tilt
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    // Calculate mouse position relative to card center (-0.5 to 0.5)
    const width = rect.width;
    const height = rect.height;

    const mouseXRel = e.clientX - rect.left;
    const mouseYRel = e.clientY - rect.top;

    const xPct = mouseXRel / width - 0.5;
    const yPct = mouseYRel / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <div style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default function AchievementsSection() {
  return (
    <SectionWrapper id="achievements" title="Achievements" subtitle="Milestones along the journey">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, margin: "-100px" }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto perspective-1000"
      >
        {achievements.map((a, i) => (
          <motion.div key={a.title} variants={item}>
            <TiltCard
              className="glass rounded-xl p-6 neon-border relative overflow-hidden group hover:neon-glow-box transition-all duration-300 h-full cursor-default"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-primary/10" />

              <DotMatrix className="opacity-50" />
              <div className="relative z-10 pointer-events-none">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-secondary/50 group-hover:bg-primary/20 transition-colors">
                  <a.icon
                    size={28}
                    className={`${a.color} drop-shadow-[0_0_10px_rgba(0,0,0,0.2)] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500`}
                  />
                </div>

                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed bg-transparent">{a.desc}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
