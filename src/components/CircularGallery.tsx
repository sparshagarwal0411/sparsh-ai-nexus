import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

interface Project {
    title: string;
    desc: string;
    tech: string[];
    live: string;
    github: string;
    accent: string;
    circleImage: string | null;
    image: string | null;
}

interface CircularGalleryProps {
    items: Project[];
}

export default function CircularGallery({ items }: CircularGalleryProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const isAnimating = useRef(false);

    const radius = 280;
    const itemSize = 140;

    // Step-by-step animation to target slide (like the reference code)
    const moveToSlide = (target: number) => {
        if (isAnimating.current || target === currentSlide) return;
        isAnimating.current = true;

        const diff = (target - currentSlide + items.length) % items.length;
        const step = diff > items.length / 2 ? -1 : 1;
        let current = currentSlide;

        const animate = () => {
            current = (current + step + items.length) % items.length;
            setCurrentSlide(current);

            if (current !== target) {
                setTimeout(animate, 300);
            } else {
                isAnimating.current = false;
            }
        };

        animate();
    };

    const handleNext = () => {
        moveToSlide((currentSlide + 1) % items.length);
    };

    const handlePrev = () => {
        moveToSlide((currentSlide - 1 + items.length) % items.length);
    };

    return (
        <div className="relative w-full min-h-[700px] flex items-center justify-center overflow-visible py-12">
            {/* Circular carousel container */}
            <div className="relative w-full h-[600px] flex items-center justify-center">
                {/* Carousel items arranged in a circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {items.map((item, index) => {
                        // Calculate angle for each item
                        const angleStep = (2 * Math.PI) / items.length;
                        const angle = angleStep * index - angleStep * currentSlide;

                        // Calculate position
                        const x = Math.sin(angle) * radius;
                        const y = -Math.cos(angle) * radius * 0.3; // Flatten the circle vertically for better view
                        const z = Math.cos(angle);

                        // Calculate scale and opacity based on position
                        const scale = 0.6 + z * 0.4; // Items in front are larger
                        const opacity = 0.3 + z * 0.7; // Items in front are more visible
                        const zIndex = Math.round((z + 1) * 100);

                        // Check if this is the active (front) item
                        const isActive = index === currentSlide;

                        return (
                            <motion.div
                                key={index}
                                className="absolute cursor-pointer"
                                style={{
                                    width: `${itemSize}px`,
                                    height: `${itemSize}px`,
                                    zIndex,
                                }}
                                animate={{
                                    x,
                                    y,
                                    scale,
                                    opacity,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                }}
                                onClick={() => moveToSlide(index)}
                            >
                                <div
                                    className={`w-full h-full rounded-full overflow-hidden border-4 transition-all duration-300 ${isActive
                                            ? "border-primary shadow-[0_0_30px_rgba(0,255,255,0.5)]"
                                            : "border-white/20 shadow-xl"
                                        }`}
                                    style={{
                                        filter: isActive ? "none" : "grayscale(30%) brightness(0.8)",
                                    }}
                                >
                                    {item.circleImage ? (
                                        <img
                                            src={item.circleImage}
                                            alt={item.title}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    ) : (
                                        <div
                                            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black text-white font-bold text-3xl ${item.accent === "primary"
                                                    ? "border-cyan-500"
                                                    : item.accent === "neon-purple"
                                                        ? "border-purple-500"
                                                        : "border-pink-500"
                                                }`}
                                        >
                                            {item.title.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Active project details - positioned below the carousel */}
                <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="text-center space-y-4 px-6"
                        >
                            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-400">
                                {items[currentSlide].title}
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {items[currentSlide].desc}
                            </p>
                            <div className="flex gap-2 justify-center flex-wrap">
                                {items[currentSlide].tech.map((t) => (
                                    <span
                                        key={t}
                                        className="px-3 py-1 bg-secondary/80 backdrop-blur-sm rounded-full text-xs font-medium"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-4 justify-center pt-2">
                                <a
                                    href={items[currentSlide].live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
                                >
                                    <ExternalLink size={16} /> Live Demo
                                </a>
                                {items[currentSlide].github !== "#" && (
                                    <a
                                        href={items[currentSlide].github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-all hover:scale-105 shadow-lg"
                                    >
                                        <Github size={16} /> Source
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => moveToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                ? "bg-primary w-8"
                                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
