import { motion, useInView, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import SectionWrapper from "./SectionWrapper";
import { Brain, Heart, Code2, Rocket, Cpu, Globe, Zap, MessageSquare, Trophy, Coffee, Sparkles, Activity } from "lucide-react";
import Snowfall from 'react-snowfall';

const stats = [
  { label: "Months Coding *", value: 11 },
  { label: "Projects *", value: 10 },
  { label: "Hackathon Podium Finishes *", value: 7 }
];

const interests = [
  { icon: Brain, label: "Machine Learning" },
  { icon: MessageSquare, label: "NLP Models" },
  { icon: Activity, label: "Football Lover" },
  { icon: Trophy, label: "Hackathon Participant" },
  { icon: Rocket, label: "Startup Enthusiast" },
  { icon: Coffee, label: "Caffeine" },
  { icon: Sparkles, label: "Gen AI" },
];

const Counter = ({ value }: { value: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const springValue = useSpring(0, { duration: 3000 });
  const displayValue = useTransform(springValue, (current) => Math.floor(current));

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
};

const Highlight = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="relative inline-block px-1">
      <motion.span
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: false }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 bg-primary/20 -z-10 skew-x-[-10deg]"
      />
      {children}
    </span>
  );
}

const FloatingIcon = ({ icon: Icon, delay, x, y }: { icon: any, delay: number, x: number, y: number }) => (
  <motion.div
    animate={{
      y: [y, y - 20, y],
      opacity: [0.3, 0.6, 0.3]
    }}
    transition={{
      duration: 5,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute text-primary/10 z-0 pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <Icon size={40} />
  </motion.div>
);

const InfiniteMarquee = () => {
  return (
    <div className="relative w-full overflow-hidden py-10 origin-center bg-transparent" style={{ transform: "rotate(-6deg) scale(1.1)" }}>
      {/* Gradient Masks for smooth fade in/out */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...interests, ...interests, ...interests].map((item, i) => (
          <div
            key={i}
            className="w-48 h-32 bg-secondary/90 border border-primary/20 rounded-xl flex flex-col items-center justify-center gap-3 shadow-lg backdrop-blur-sm hover:border-primary/50 transition-colors group relative overflow-hidden"
          >
            {/* <Snowfall color="#00D8FF" snowflakeCount={30} /> */}
            <item.icon size={32} className="text-primary group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-medium text-foreground/90">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function AboutSection() {
  return (
    <SectionWrapper id="about" title="About Me" subtitle="B.Tech ECE @ NSUT (2029) — Passionate about AI for social good">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto relative perspective-1000">

        {/* Floating Icons Background */}
        <FloatingIcon icon={Cpu} delay={0} x={10} y={10} />
        <FloatingIcon icon={Globe} delay={2} x={80} y={20} />
        <FloatingIcon icon={Zap} delay={4} x={90} y={80} />

        {/* Left: Marquee */}
        <div className="relative order-2 md:order-1 py-10 overflow-hidden rounded-2xl">
          <InfiniteMarquee />
        </div>

        {/* Right: Content */}
        <div className="space-y-6 order-1 md:order-2 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">Hello!</span> I'm Sparsh.
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg mb-4">
              I am a <span className="text-foreground font-medium">Full Stack Developer</span> and <span className="text-foreground font-medium">AI Enthusiast</span> currently pursuing my B.Tech at Netaji Subhas University of Technology.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              My journey involves building <Highlight>tech for social good</Highlight>. Whether it's empowering women through entrepreneurship platforms or solving civic issues with clean-tech, I believe in code that makes a difference.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <h4 className="text-3xl md:text-4xl font-bold text-primary tabular-nums">
                    <Counter value={stat.value} />+
                  </h4>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </SectionWrapper>
  );
}
