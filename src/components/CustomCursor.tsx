
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", updatePosition);
        return () => window.removeEventListener("mousemove", updatePosition);
    }, []);

    return (
        <>
            {/* Main Cursor */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
                animate={{ x: position.x - 8, y: position.y - 8 }}
                transition={{ type: "spring", stiffness: 1000, damping: 50, mass: 0.1 }}
            />
            {/* Trailing Glow */}
            <motion.div
                className="fixed top-0 left-0 w-12 h-12 border border-primary/50 rounded-full pointer-events-none z-[9998]"
                animate={{ x: position.x - 24, y: position.y - 24 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, mass: 1 }}
            />
        </>
    );
};
