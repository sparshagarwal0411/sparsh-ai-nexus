import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Play } from "lucide-react";
import { soundManager } from "@/utils/SoundManager";

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
  typeSpeed?: number;
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

type Phase = "terminal" | "greetings" | "helloworld" | "done";

const GREETINGS = [
  "नमस्ते!",     // Hindi
  "Ciao!",       // Italian
  "ありがとう!",  // Japanese
  "Bonjour!",    // French
  "Hola!",       // Spanish
  "Hello!",      // English
];

export default function TerminalLoader({ onComplete }: TerminalLoaderProps) {
  const [lines, setLines] = useState<DisplayLine[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [activePrompt, setActivePrompt] = useState("");
  const [progressVal, setProgressVal] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const [phase, setPhase] = useState<Phase>("terminal");
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [greetingVisible, setGreetingVisible] = useState(true);
  const [hwTyped, setHwTyped] = useState("");
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
      text: "⠋ resolving dependencies...",
      lineType: "info",
      typeSpeed: 30,
      delayAfter: 150,
    },
    {
      type: "logs",
      logs: [
        { text: "✔ fetch metadata @react-three/fiber@8.18.0", type: "success" },
        { text: "✔ fetch metadata framer-motion@11.18.2", type: "success" },
        { text: "✔ fetch metadata three@0.170.0", type: "success" },
        { text: "ℹ executing post-install hooks...", type: "info" },
      ],
      interval: 150,
      delayAfter: 200,
    },
    {
      type: "progress",
      label: "Installing dependency tree",
      duration: 1200,
      delayAfter: 200,
    },
    {
      type: "instant",
      text: "✔ Added 1432 packages in 1.48s",
      lineType: "success",
      delayAfter: 200,
    },
    {
      type: "instant",
      text: "✔ Found 0 vulnerabilities. System secure.",
      lineType: "success",
      delayAfter: 400,
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
      delayAfter: 200,
    },
    {
      type: "instant",
      text: "> sparsh-ai-nexus@3.0.0 dev",
      lineType: "info",
      delayAfter: 150,
    },
    {
      type: "instant",
      text: "> vite",
      lineType: "info",
      delayAfter: 150,
    },
    {
      type: "instant",
      text: "  VITE v5.4.19  ready in 342 ms",
      lineType: "success",
      delayAfter: 200,
    },
    {
      type: "instant",
      text: "  ➜  Local:   http://localhost:5173/",
      lineType: "info",
      delayAfter: 150,
    },
    {
      type: "progress",
      label: "Compiling WebGL & shaders",
      duration: 1000,
      delayAfter: 300,
    },
    {
      type: "instant",
      text: "  ➜  3D Particle Scene: INITIALIZED",
      lineType: "success",
      delayAfter: 200,
    },
    {
      type: "instant",
      text: "  ➜  status: READY. Starting Sparsh AI Nexus...",
      lineType: "success",
      delayAfter: 500,
    },
  ];

  // Auto-scroll to terminal bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, typedText, progressVal]);

  // Unlock audio on first interaction (browser autoplay policy)
  useEffect(() => {
    const unlock = () => soundManager.unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

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
    soundManager.stopLoadingSound();
    soundManager.setMuted(false);
    soundManager.unlockAudio();
    soundManager.playTransitionSound();
    soundManager.enableMainPageSound();
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  // Greetings rolling sequence
  useEffect(() => {
    if (phase !== "greetings" || isExiting) return;

    if (greetingIndex >= GREETINGS.length) {
      const timer = setTimeout(() => setPhase("helloworld"), 700);
      return () => clearTimeout(timer);
    }

    setGreetingVisible(true);
    soundManager.playPageFlip(true);

    let advanceTimer: ReturnType<typeof setTimeout>;
    const holdTimer = setTimeout(() => {
      setGreetingVisible(false);
      advanceTimer = setTimeout(() => {
        setGreetingIndex((i) => i + 1);
      }, 400);
    }, 800);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(advanceTimer);
    };
  }, [phase, greetingIndex, isExiting]);

  // Hello World typewriter
  useEffect(() => {
    if (phase !== "helloworld" || isExiting) return;

    const text = "Hello World";
    setHwTyped("");
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex < text.length) {
        setHwTyped(text.slice(0, charIndex + 1));
        soundManager.playTypeKey(true);
        charIndex++;
      } else {
        clearInterval(interval);
        soundManager.setMuted(false);
        soundManager.unlockAudio();
        setTimeout(() => handleSkip(), 1400);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [phase, isExiting]);

  // State machine loop
  useEffect(() => {
    if (isExiting || phase !== "terminal") return;

    if (currentStepIndex >= steps.length) {
      const timer = setTimeout(() => setPhase("greetings"), 500);
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
          soundManager.playTypeKey(true);
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
      if (!step.text) {
        const timer = setTimeout(() => {
          setLines((prev) => [...prev, { text: step.text, type: step.lineType }]);
          setCurrentStepIndex((idx) => idx + 1);
        }, step.delayAfter || 100);
        return () => clearTimeout(timer);
      }

      if (step.typeSpeed) {
        let charIndex = 0;
        setLines((prev) => [...prev, { text: "", type: step.lineType }]);

        const interval = setInterval(() => {
          if (charIndex < step.text.length) {
            const char = step.text[charIndex];
            charIndex++;
            soundManager.playTypeKey(true);
            setLines((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              next[next.length - 1] = { ...last, text: last.text + char };
              return next;
            });
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentStepIndex((idx) => idx + 1);
            }, step.delayAfter || 100);
          }
        }, step.typeSpeed);

        return () => clearInterval(interval);
      }

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
          soundManager.playTypeKey(true);
          setLines((prev) => [...prev, { text: currentLog.text, type: currentLog.type }]);
          logIdx++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentStepIndex((idx) => idx + 1);
          }, step.delayAfter || 60);
        }
      }, step.interval);

      return () => clearInterval(interval);
    }

    if (step.type === "progress") {
      setProgressLabel(step.label);
      setProgressVal(0);
      soundManager.startLoadingSound(true);

      const startTime = Date.now();
      const duration = step.duration;

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percent = Math.min(Math.floor((elapsed / duration) * 100), 100);

        setProgressVal(percent);

        if (percent >= 100) {
          clearInterval(timer);
          soundManager.stopLoadingSound();
          setTimeout(() => {
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

      return () => {
        clearInterval(timer);
        soundManager.stopLoadingSound();
      };
    }
  }, [currentStepIndex, isExiting, phase]);

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
          <style dangerouslySetInnerHTML={{
            __html: `
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
          <AnimatePresence>
            {phase === "terminal" && (
              <motion.div
                key="terminal-window"
                initial={{ scale: 0.92, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative w-full max-w-2xl mx-3 sm:mx-4 rounded-lg border border-primary/20 bg-slate-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col h-[min(72vh,420px)] sm:h-[450px]"
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
                <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-2 sm:space-y-2.5 text-[11px] sm:text-sm font-mono scrollbar-none">
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
            )}
          </AnimatePresence>

          {/* Rolling greetings → Hello → Hello World */}
          <AnimatePresence>
            {(phase === "greetings" || phase === "helloworld") && (
              <motion.div
                key="greeting-sequence"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-10"
              >
                {phase === "greetings" && greetingIndex < GREETINGS.length && (
                  <AnimatePresence mode="wait">
                    {greetingVisible && (
                      <motion.div
                        key={greetingIndex}
                        initial={{ opacity: 0, y: 40, rotateX: -20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, y: -40, rotateX: 20 }}
                        transition={{ duration: 0.28, ease: [0.43, 0.13, 0.23, 0.96] }}
                        className="text-center"
                      >
                        <h1 className="greeting-native text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-primary to-emerald-300 tracking-tight">
                          {GREETINGS[greetingIndex]}
                        </h1>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {phase === "helloworld" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className="text-center"
                  >
                    <h1 className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-emerald-300 tracking-tight">
                      {hwTyped}
                      <span className="inline-block w-[3px] sm:w-1 h-10 sm:h-14 ml-1 bg-primary align-middle term-cursor" />
                    </h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hwTyped === "Hello World" ? 1 : 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 text-xs sm:text-sm text-primary/40 tracking-[0.4em] uppercase"
                    >
                      Welcome to Sparsh AI Nexus
                    </motion.p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom right Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            onClick={handleSkip}
            className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 sm:bottom-8 sm:right-8 px-3 sm:px-4 py-2 rounded-md glass neon-border text-[11px] sm:text-xs text-primary font-mono tracking-wider flex items-center gap-2 cursor-pointer z-50 hover:bg-primary/5"
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
