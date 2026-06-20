import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { soundManager } from "@/utils/SoundManager";

export default function AudioToggle() {
  const [isMuted, setIsMuted] = useState(() => soundManager.getIsMuted());
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && !!sessionStorage.getItem("sparsh_loaded")
  );

  useEffect(() => {
    const unmute = () => {
      setIsMuted(false);
      soundManager.setMuted(false);
      soundManager.unlockAudio();
    };

    const onLoaderComplete = () => {
      unmute();
      setVisible(true);
    };

    if (sessionStorage.getItem("sparsh_loaded")) {
      unmute();
      setVisible(true);
    }

    window.addEventListener("loaderComplete", onLoaderComplete);

    return () => {
      window.removeEventListener("loaderComplete", onLoaderComplete);
    };
  }, []);

  const toggleAudio = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundManager.setMuted(newMuted);
    if (!newMuted) {
      void soundManager.unlockAudio();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 md:left-8 md:right-auto md:bottom-8 z-[90] flex items-center gap-3">
      <button
        onClick={toggleAudio}
        className="w-11 h-11 md:w-12 md:h-12 rounded-full glass neon-border flex items-center justify-center text-primary group transition-all hover:scale-110 shadow-lg"
        title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
      </button>

      {!isMuted && (
        <div className="hidden sm:flex items-center gap-[2px] h-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                height: [4, 12, 6, 14, 4],
              }}
              transition={{
                duration: 0.5 + i * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-[2px] bg-primary/60 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
