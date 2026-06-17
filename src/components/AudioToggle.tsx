import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { soundManager } from "@/utils/SoundManager";

export default function AudioToggle() {
  const [isMuted, setIsMuted] = useState(true);

  const toggleAudio = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundManager.setMuted(newMuted);
  };

  return (
    <div className="fixed left-8 bottom-8 z-[100000] flex items-center gap-4">
      <button
        onClick={toggleAudio}
        className="w-12 h-12 rounded-full glass neon-border flex items-center justify-center text-primary group transition-all hover:scale-110"
        title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
      </button>

      {!isMuted && (
        <div className="flex items-center gap-[2px] h-3">
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
