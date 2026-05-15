import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";

interface Project {
    title: string;
    desc: string;
    tech: string[];
    live: string;
    github: string;
    accent: string;
    image: string | null;
}

interface CinematicCarouselProps {
    items: Project[];
}

const slideTransition = {
    duration: 1,
    ease: [0.22, 1, 0.36, 1],
};

export default function CinematicCarousel({ items }: CinematicCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    useEffect(() => {
        if (!isHovering) {
            autoplayRef.current = setInterval(handleNext, 5000);
        } else if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
        }
        return () => {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
        };
    }, [isHovering, handleNext]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth) * 2 - 1;
        const y = (clientY / innerHeight) * 2 - 1;
        setMousePosition({ x, y });
    };

    const currentProject = items[currentIndex];

    return (
        <div
            className="relative w-full h-[85vh] min-h-[700px] overflow-hidden bg-black select-none"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={slideTransition}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Main Background Image */}
                    <motion.div
                        initial={{ scale: 1.1, filter: "blur(4px)" }}
                        animate={{ scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${currentProject.image || '/placeholder.svg'})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                    </motion.div>

                    {/* Content Layout */}
                    <div className="relative z-10 container mx-auto h-full px-6 flex flex-col justify-center items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ ...slideTransition, delay: 0.3 }}
                            className="max-w-xl space-y-6"
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase bg-primary/10 text-primary border border-primary/20 rounded-full backdrop-blur-sm"
                            >
                                Project #{currentIndex + 1}
                            </motion.span>

                            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight">
                                {currentProject.title}
                            </h1>

                            <p className="text-xl text-white/70 leading-relaxed font-medium max-w-md">
                                {currentProject.desc}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {currentProject.tech.map((tech) => (
                                    <span key={tech} className="px-4 py-1.5 text-xs bg-white/5 border border-white/10 rounded-full text-white/60 font-semibold uppercase tracking-wider">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <a
                                    href={currentProject.live}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group relative flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold transition-all hover:bg-primary hover:text-white"
                                >
                                    <ExternalLink size={20} /> View Project
                                </a>
                                {currentProject.github !== "#" && (
                                    <a
                                        href={currentProject.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 bg-white/5 text-white border border-white/10 backdrop-blur-md px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
                                    >
                                        <Github size={20} /> Source
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Focal Circle in Corner */}
                    <motion.div
                        animate={{
                            x: mousePosition.x * 30,
                            y: mousePosition.y * 30 + Math.sin(Date.now() / 1500) * 15
                        }}
                        transition={{ type: "spring", stiffness: 40, damping: 20 }}
                        className="absolute top-20 right-20 w-64 h-64 rounded-full border border-white/20 overflow-hidden hidden lg:block z-0 opacity-40 grayscale blur-[1px]"
                    >
                        <img src={currentProject.image || '/placeholder.svg'} alt="" className="w-full h-full object-contain scale-110" />
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Semi-Circular Logo Carousel on Right Side */}
            <div className="absolute top-1/2 -right-40 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none hidden md:block">
                <div className="relative w-full h-full">
                    {items.map((item, idx) => {
                        // Calculate relative index for circular positioning
                        const relativeIdx = (idx - currentIndex + items.length) % items.length;

                        // We only show current, one above, one below clearly, others further back/smaller
                        let angle = 0;
                        let scale = 0;
                        let opacity = 0;
                        let blur = "blur(0px)";

                        if (relativeIdx === 0) {
                            angle = 0; scale = 1; opacity = 1;
                        } else if (relativeIdx === 1) {
                            angle = 35; scale = 0.6; opacity = 0.4; blur = "blur(2px)";
                        } else if (relativeIdx === items.length - 1) {
                            angle = -35; scale = 0.6; opacity = 0.4; blur = "blur(2px)";
                        } else if (relativeIdx === 2) {
                            angle = 60; scale = 0.4; opacity = 0.1; blur = "blur(4px)";
                        } else if (relativeIdx === items.length - 2) {
                            angle = -60; scale = 0.4; opacity = 0.1; blur = "blur(4px)";
                        }

                        if (opacity === 0) return null;

                        return (
                            <motion.div
                                key={`logo-${idx}`}
                                animate={{
                                    rotate: angle,
                                    x: Math.cos((angle * Math.PI) / 180) * 300 - 300,
                                    y: Math.sin((angle * Math.PI) / 180) * 300,
                                    scale,
                                    opacity,
                                    filter: blur
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 20,
                                    duration: 0.8
                                }}
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-white/30 overflow-hidden shadow-2xl p-2 bg-black/40 backdrop-blur-xl"
                            >
                                <img
                                    src={item.image || '/placeholder.svg'}
                                    alt={item.title}
                                    className="w-full h-full object-contain rounded-full"
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-12 right-12 z-20 flex gap-6">
                <button
                    onClick={handlePrev}
                    className="group w-14 h-14 flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white hover:bg-white hover:text-black transition-all shadow-2xl"
                >
                    <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={handleNext}
                    className="group w-14 h-14 flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white hover:bg-white hover:text-black transition-all shadow-2xl"
                >
                    <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Progress Dots */}
            <div className="absolute bottom-12 left-12 z-20 flex items-center gap-4">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-500 rounded-full h-1.5 ${idx === currentIndex ? 'w-12 bg-primary' : 'w-4 bg-white/20'}`}
                    />
                ))}
            </div>
        </div>
    );
}
