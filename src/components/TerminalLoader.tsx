import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Play } from "lucide-react";

interface TerminalLoaderProps {
  onComplete: () => void;
}

type LineType = "prompt" | "input" | "output" | "success" | "warning" | "info" | "progress";

interface DisplayLine {
  text: string;
  type: LineType;
  promptText?: string;
  isTypingDone?: boolean;
}

interface StepTypewrite {
  type: "typewrite";
  prompt: string;
  text: string;
  speed?: number;
  delayAfter?: number;
}

interface StepInstant {
  type: "instant";
  text: string;
  lineType: LineType;
  delayAfter?: number;
}

interface StepLogs {
  type: "logs";
  logs: { text: string; type: LineType }[];
  interval: number;
  delayAfter?: number;
}

interface StepProgress {
  type: "progress";
  label: string;
  duration: number;
  delayAfter?: number;
}

type Step = StepTypewrite | StepInstant | StepLogs | StepProgress;

export default function TerminalLoader({ onComplete }: TerminalLoaderProps) {
  const [lines, setLines] = useState<DisplayLine[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [activePrompt, setActivePrompt] = useState("");
  const [progressVal, setProgressVal] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const steps: Step[] = [
    {
      type: "typewrite",
      prompt: "sparsh@nexus-os:~$ ",
      text: "npm install --global sparsh-nexus-cli",
      speed: 40,
      delayAfter: 200,
    },
    {
      type: "instant",
      text: "⠋ resolving dependencies in package.json...",
      lineType: "info",
      delayAfter: 300,
    },
    {
      type: "logs",
      logs: [
        { text: "✔ fetch metadata @react-three/fiber@8.18.0", type: "success" },
        { text: "✔ fetch metadata framer-motion@11.18.2", type: "success" },
        { text: "✔ fetch metadata tailwindcss@3.4.17", type: "success" },
        { text: "✔ fetch metadata three@0.170.0", type: "success" },
        { text: "ℹ extracting local tarballs...", type: "info" },
        { text: "ℹ building tree structural nodes...", type: "info" },
        { text: "ℹ executing post-install hooks...", type: "info" },
      ],
      interval: 80,
      delayAfter: 200,
    },
    {
      type: "progress",
      label: "Installing dependency tree",
      duration: 800,
      delayAfter: 200,
    },
    {
      type: "instant",
      text: "✔ Added 1432 packages in 1.48s",
      lineType: "success",
      delayAfter: 150,
    },
    {
      type: "instant",
      text: "✔ Found 0 vulnerabilities. System secure.",
      lineType: "success",
      delayAfter: 450,
    },
    {
      type: "instant",
      text: "",
      lineType: "output",
      delayAfter: 150,
    },
    {
      type: "typewrite",
      prompt: "sparsh@nexus-os:~$ ",
      text: "npm run dev",
      speed: 50,
      delayAfter: 250,
    },
    {
      type: "instant",
      text: "> sparsh-ai-nexus@3.0.0 dev",
      lineType: "info",
      delayAfter: 100,
    },
    {
      type: "instant",
      text: "> vite",
      lineType: "info",
      delayAfter: 100,
    },
    {
      type: "instant",
      text: "  VITE v5.4.19  ready in 342 ms",
      lineType: "success",
      delayAfter: 150,
    },
    {
      type: "instant",
      text: "  ➜  Local:   http://localhost:5173/",
      lineType: "info",
      delayAfter: 100,
    },
    {
      type: "instant",
      text: "  ➜  Network: use --host to expose",
      lineType: "warning",
      delayAfter: 100,
    },
    {
      type: "progress",
      label: "Compiling WebGL & shaders",
      duration: 900,
      delayAfter: 250,
    },
    {
      type: "instant",
      text: "  ➜  Asset Pipeline: BUNDLED (42 assets)",
      lineType: "success",
      delayAfter: 100,
    },
    {
      type: "instant",
      text: "  ➜  3D Particle Scene: INITIALIZED",
      lineType: "success",
      delayAfter: 100,
    },
    {
      type: "instant",
      text: "  ➜  status: READY. Starting Sparsh AI Nexus...",
      lineType: "success",
      delayAfter: 600,
    },
  ];

  // Auto-scroll to terminal bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, typedText, progressVal]);

  // Handle ESC key to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSkip = () => {
    setIsExiting(true);
    sessionStorage.setItem("sparsh_loaded", "true");
    setTimeout(() => {
      onComplete();
    }, 600); // Allow exit animation to complete
  };

  // State machine loop
  useEffect(() => {
    if (isExiting) return;

    if (currentStepIndex >= steps.length) {
      // Finished all steps, delay slightly and exit
      const timer = setTimeout(() => {
        handleSkip();
      }, 300);
      return () => clearTimeout(timer);
    }

    const step = steps[currentStepIndex];

    if (step.type === "typewrite") {
      setActivePrompt(step.prompt);
      setTypedText("");
      let charIndex = 0;
      
      const interval = setInterval(() => {
        const charToType = step.text[charIndex];
        if (charToType !== undefined) {
          setTypedText((prev) => prev + charToType);
          charIndex++;
        }
        
        if (charIndex >= step.text.length) {
          clearInterval(interval);
          setTimeout(() => {
            // Commit typed text as a line
            setLines((prev) => [
              ...prev,
              { text: step.text, type: "input", promptText: step.prompt, isTypingDone: true },
            ]);
            setTypedText("");
            setActivePrompt("");
            setCurrentStepIndex((idx) => idx + 1);
          }, step.delayAfter || 200);
        }
      }, step.speed || 50);

      return () => clearInterval(interval);
    } 
    
    if (step.type === "instant") {
      const timer = setTimeout(() => {
        setLines((prev) => [...prev, { text: step.text, type: step.lineType }]);
        setCurrentStepIndex((idx) => idx + 1);
      }, step.delayAfter || 100);
      return () => clearTimeout(timer);
    } 
    
    if (step.type === "logs") {
      let logIdx = 0;
      const interval = setInterval(() => {
        if (logIdx < step.logs.length) {
          const currentLog = step.logs[logIdx];
          setLines((prev) => [
            ...prev,
            { text: currentLog.text, type: currentLog.type },
          ]);
          logIdx++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentStepIndex((idx) => idx + 1);
          }, step.delayAfter || 100);
        }
      }, step.interval);

      return () => clearInterval(interval);
    } 
    
    if (step.type === "progress") {
      setProgressLabel(step.label);
      setProgressVal(0);
      
      const startTime = Date.now();
      const duration = step.duration;

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percent = Math.min(Math.floor((elapsed / duration) * 100), 100);
        
        setProgressVal(percent);

        if (percent >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            // Commit progress bar as plain output line
            const barWidth = 20;
            const filledWidth = Math.round((percent / 100) * barWidth);
            const emptyWidth = barWidth - filledWidth;
            const barText = `[${"█".repeat(filledWidth)}${"░".repeat(emptyWidth)}] ${percent}% - ${step.label}`;
            
            setLines((prev) => [...prev, { text: barText, type: "progress" }]);
            setProgressVal(0);
            setProgressLabel("");
            setCurrentStepIndex((idx) => idx + 1);
          }, step.delayAfter || 200);
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [currentStepIndex, isExiting]);

  const renderLineColor = (type: LineType) => {
    switch (type) {
      case "prompt":
        return "text-cyan-400 font-bold";
      case "input":
        return "text-slate-100 font-semibold";
      case "success":
        return "text-emerald-400";
      case "warning":
        return "text-amber-400";
      case "info":
        return "text-purple-400";
      case "progress":
        return "text-cyan-500/80";
      default:
        return "text-slate-300";
    }
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.05, 
            filter: "blur(10px)"
          }}
          transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[99999] bg-[#030712] flex items-center justify-center font-mono overflow-hidden select-none"
        >
          {/* CRT Screen FX Styles */}
          <style dangerouslySetInnerHTML={{ __html: `
            .crt-overlay {
              background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
              background-size: 100% 3px, 6px 100%;
            }
            .crt-flicker {
              animation: crt-flicker-anim 0.25s infinite;
            }
            @keyframes crt-flicker-anim {
              0% { opacity: 0.995; }
              50% { opacity: 0.985; }
              100% { opacity: 0.995; }
            }
            @keyframes cursor-blink-anim {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
            .term-cursor {
              animation: cursor-blink-anim 0.8s step-end infinite;
            }
          `}} />

          {/* Retro grids background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,24,48,0.3)_0%,rgba(3,7,18,1)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(186,100,50,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(186,100,50,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          {/* CRT scanlines effect */}
          <div className="crt-overlay crt-flicker absolute inset-0 pointer-events-none" />

          {/* Central Terminal Window */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full max-w-2xl mx-4 rounded-lg border border-primary/20 bg-slate-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col h-[420px] sm:h-[450px]"
          >
            {/* Terminal Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-primary/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/30" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/30" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/30" />
              </div>
              
              <div className="flex items-center gap-2 text-xs text-primary/70">
                <Terminal size={12} className="text-primary animate-pulse" />
                <span className="font-semibold tracking-wider font-mono-code">sparsh@nexus-os: ~</span>
              </div>

              <div className="w-14" /> {/* spacer balance */}
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-2.5 text-xs sm:text-sm font-mono scrollbar-none">
              {/* Previous Lines */}
              {lines.map((line, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1">
                  {line.promptText && (
                    <span className="text-cyan-400 font-bold shrink-0">{line.promptText}</span>
                  )}
                  <span className={renderLineColor(line.type)}>
                    {line.text}
                  </span>
                </div>
              ))}

              {/* Active typing line */}
              {activePrompt && (
                <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                  <span className="text-cyan-400 font-bold shrink-0">{activePrompt}</span>
                  <span className="text-slate-100 font-semibold break-all">
                    {typedText}
                    <span className="inline-block w-2 h-4 ml-1 bg-primary align-middle term-cursor" />
                  </span>
                </div>
              )}

              {/* Active Progress Bar Line */}
              {progressLabel && (
                <div className="space-y-1">
                  <div className="text-cyan-500/80 flex items-center justify-between">
                    <span>{progressLabel}...</span>
                    <span>{progressVal}%</span>
                  </div>
                  <div className="text-cyan-500/80 leading-none">
                    {(() => {
                      const barWidth = 20;
                      const filledWidth = Math.round((progressVal / 100) * barWidth);
                      const emptyWidth = barWidth - filledWidth;
                      return `[${"█".repeat(filledWidth)}${"░".repeat(emptyWidth)}]`;
                    })()}
                  </div>
                </div>
              )}

              {/* Inactive trailing prompt if nothing is typing */}
              {!activePrompt && !progressLabel && currentStepIndex < steps.length && (
                <div className="flex items-center gap-1">
                  <span className="text-cyan-400 font-bold">sparsh@nexus-os:~$</span>
                  <span className="inline-block w-2 h-4 bg-primary/70 term-cursor" />
                </div>
              )}

              <div ref={terminalEndRef} />
            </div>

            {/* Subtle Terminal Scan Lines Glow */}
            <div className="absolute inset-0 pointer-events-none border border-primary/5 rounded-lg" />
          </motion.div>

          {/* Bottom right Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 px-4 py-2 rounded-md glass neon-border text-xs text-primary font-mono tracking-wider flex items-center gap-2 cursor-pointer z-50 hover:bg-primary/5"
          >
            <Play size={10} className="fill-primary text-primary" />
            <span>Skip Intro</span>
            <span className="text-[10px] opacity-60 px-1 py-0.5 rounded bg-slate-900 border border-primary/20">Esc</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
