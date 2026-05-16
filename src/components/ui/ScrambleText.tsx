import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScrambleTextProps {
  text: string;
  duration?: number;
  delay?: number;
  className?: string;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|;:,.<>?";

export default function ScrambleText({ text, duration = 0.6, delay = 0, className = "" }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const [isScrambling, setIsScrambling] = useState(false);

  useEffect(() => {
    if (isInView && !isScrambling) {
      scramble();
    }
  }, [isInView]);

  const scramble = async () => {
    setIsScrambling(true);
    let iteration = 0;
    const maxIterations = Math.floor(duration * 60); // 60fps approx
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const interval = setInterval(() => {
      const timeRemaining = endTime - Date.now();
      
      if (timeRemaining <= 0) {
        setDisplayText(text);
        setIsScrambling(false);
        clearInterval(interval);
        return;
      }

      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < (iteration / maxIterations) * text.length) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      iteration += 1;
    }, 1000 / 60);

    return () => clearInterval(interval);
  };

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={`inline-block font-mono-code ${className}`}
    >
      {displayText}
    </motion.span>
  );
}
