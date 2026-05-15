import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import DotMatrix from "./ui/DotMatrix";
import { Trophy, Zap, Award, Star, Crown, Medal } from "lucide-react";
import React, { useRef } from "react";

const achievements = [
  {
    icon: Trophy,
    title: "Hackathon Winner",
    desc: "Built award-winning civic tech solutions under 24-hour constraints, solving real-world urban challenges.",
    color: "text-yellow-400",
    className: "md:col-span-2 md:row-span-2",
    accent: "from-yellow-400/40 to-orange-500/20",
    bgImage: "/hackathon-win.jpg"
  },
  {
    icon: Crown,
    title: "Rapid Innovator",
    desc: "Deployed 10+ full-stack MVPs in less than 6 months with cutting-edge tech.",
    color: "text-primary",
    className: "md:col-span-1",
    accent: "from-primary/20 to-purple-600/10"
  },
  {
    icon: Medal,
    title: "Open Source",
    desc: "Active contributor to leading AI libraries and developer tools.",
    color: "text-green-400",
    className: "md:col-span-1",
    accent: "from-green-400/20 to-emerald-600/10",
    bgImage: "/pic3.png"
  },
  {
    icon: Star,
    title: "Community Builder",
    desc: "Made softwares and tech reaching 500+ student developers.",
    color: "text-pink-400",
    className: "md:col-span-1",
    accent: "from-pink-400/20 to-rose-600/10",
    bgImage: "/pic4.JPG"
  },
  {
    icon: Zap,
    title: "AI Project Lead",
    desc: "Demonstrated strong technical leadership by guiding AI projects from conception to deployment.",
    color: "text-blue-400",
    className: "md:col-span-2",
    accent: "from-blue-400/20 to-cyan-600/10",
    bgImage: "/pic5.jpg"
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 15
    }
  }
}

const TiltCard = ({ children, className, accent, bgImage }: { children: React.ReactNode, className?: string, accent: string, bgImage?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
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
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.02, z: 50 }}
      className={`glass rounded-3xl p-8 neon-border relative overflow-hidden group transition-all duration-500 h-full cursor-pointer flex flex-col justify-between ${className}`}
    >
      {/* Background Image with Overlay */}
      {bgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-700 scale-110 group-hover:scale-100"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
        </>
      )}

      {/* Dynamic Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} ${bgImage ? 'opacity-20' : 'opacity-0'} group-hover:opacity-100 transition-opacity duration-700`} />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
      <DotMatrix className={`${bgImage ? 'opacity-10' : 'opacity-30'} group-hover:opacity-50 transition-opacity`} />

      <div className="relative z-10 flex flex-col h-full" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default function AchievementsSection() {
  return (
    <SectionWrapper id="achievements" title="Achievements" subtitle="Pushing boundaries and setting new benchmarks">
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Ambient background orbs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none delay-1000" />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-2000"
        >
          {achievements.map((a, i) => (
            <motion.div key={a.title} variants={item} className={a.className}>
              <TiltCard accent={a.accent} bgImage={a.bgImage}>
                <div className="flex flex-col gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <a.icon size={32} className={`${a.color} filter drop-shadow-[0_0_8px_currentColor]`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:gradient-text transition-all">
                      {a.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                      {a.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs font-mono text-white/30 group-hover:text-primary transition-colors">
                  <span className="w-8 h-[1px] bg-white/10 group-hover:bg-primary transition-colors" />
                  MILESTONE {String(i + 1).padStart(2, '0')}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Summary Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 glass rounded-2xl p-6 flex flex-wrap justify-around items-center border border-white/5 bg-white/[0.02]"
        >
          {[
            { label: "Hackathons Won", value: "02" },
            { label: "Community Impact", value: "1K+" },
            { label: "GitHub Repos", value: "25+" },
            { label: "Lines of Code", value: "100K+" }
          ].map((stat, i) => (
            <div key={i} className="text-center px-4 py-2">
              <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
