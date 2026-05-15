import { lazy, Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, FolderOpen, FileText, Download, Instagram } from "lucide-react";

const ParticleScene = lazy(() => import("./ParticleScene"));

const TypingEffect = ({ text, speed = 100, delay = 0 }: { text: string; speed?: number; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let currentIndex = 0;

    // Reset when text changes
    setDisplayedText("");

    const startTyping = () => {
      const typeChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeoutId = setTimeout(typeChar, speed);
        }
      };
      typeChar();
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(delayTimeout);
    };
  }, [text, speed, delay]);

  return <span>{displayedText}</span>;
};

// Cycle through titles
const RotatingSubtitle = () => {
  const titles = [
    "AI Developer",
    "Civic Tech Builder",
    "Hackathon Enthusiast"
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <div className="h-8 md:h-10 flex justify-center items-center">
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-lg md:text-xl text-muted-foreground"
      >
        {titles[index]}
      </motion.span>
    </div>
  );
}


// Type out name once
const NameTypingEffect = ({ text = "Sparsh Agarwal" }: { text?: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 150); // Speed of typing

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="gradient-text">
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[3px] h-[0.8em] bg-primary ml-1 align-middle"
      />
    </span>
  );
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <ParticleScene />
      </Suspense>

      {/* Radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background))_75%)] z-[1]" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
        >
          Hello World — I'm
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.0 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight min-h-[1.2em]"
        >
          <NameTypingEffect />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-10"
        >
          <RotatingSubtitle />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_25px_hsl(var(--primary)/0.4)] transition-all duration-300"
          >
            <FolderOpen size={18} />
            Projects
          </a>
          <a
            href="/resume.pdf"
            download="Sparsh_Agarwal_Resume.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 neon-border group"
          >
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            Resume
          </a>

        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <a href="#about" aria-label="Scroll down">
            <ArrowDown size={20} className="text-muted-foreground animate-float" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
