import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, User, Code, Trophy, Mail, Github, Linkedin, ExternalLink, X, FileText } from "lucide-react";

const ACTIONS = [
  { icon: User, label: "Go to About", href: "#about", category: "Navigation" },
  { icon: Code, label: "View Projects", href: "#projects", category: "Navigation" },
  { icon: Trophy, label: "Achievements", href: "#achievements", category: "Navigation" },
  { icon: Mail, label: "Contact Me", href: "#contact", category: "Navigation" },
  { icon: Github, label: "GitHub Profile", href: "https://github.com/sparshagarwal0411", category: "Social" },
  { icon: Linkedin, label: "LinkedIn Profile", href: "https://linkedin.com/in/sparshagarwal0411", category: "Social" },
  { icon: FileText, label: "Download Resume", href: "/resume.pdf", category: "Action", download: true },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const filteredActions = ACTIONS.filter((action) =>
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleAction = (href: string, download?: boolean) => {
    if (download) {
      const link = document.createElement("a");
      link.href = href;
      link.download = "Sparsh_Agarwal_Resume.pdf";
      link.click();
    } else if (href.startsWith("#")) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button Overlay (Visible on mobile or as hint) */}
      <div className="fixed bottom-6 left-6 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full glass neon-border flex items-center justify-center text-primary shadow-lg"
        >
          <Command size={20} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Palette Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center p-4 border-b border-white/10 bg-white/5">
                <Search size={20} className="text-muted-foreground mr-3" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands, sections, or links..."
                  className="w-full bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground"
                />
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-muted-foreground">
                  <span className="text-xs">ESC</span>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-none">
                {filteredActions.length > 0 ? (
                  <div className="space-y-4 py-2">
                    {["Navigation", "Social", "Action"].map((category) => {
                      const categoryActions = filteredActions.filter(a => a.category === category);
                      if (categoryActions.length === 0) return null;
                      
                      return (
                        <div key={category}>
                          <h3 className="px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                            {category}
                          </h3>
                          <div className="mt-1 space-y-1">
                            {categoryActions.map((action) => (
                              <button
                                key={action.label}
                                onClick={() => handleAction(action.href, action.download)}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-left group"
                              >
                                <action.icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="flex-1 font-medium">{action.label}</span>
                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>No results found for "{query}"</p>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-white/10 bg-white/5 flex justify-between items-center text-[10px] text-muted-foreground">
                <div className="flex gap-4">
                  <span><span className="text-foreground">↑↓</span> to navigate</span>
                  <span><span className="text-foreground">ENTER</span> to select</span>
                </div>
                <div className="font-mono">Nexus CLI v1.0</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
