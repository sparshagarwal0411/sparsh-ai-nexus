import { motion } from "framer-motion";

interface DotMatrixProps {
    className?: string;
}

export default function DotMatrix({ className = "" }: DotMatrixProps) {
    // Create a grid of dots
    // We'll use a 10x10 grid for coverage, masked by overflow-hidden in parent
    const rows = 12;
    const cols = 12;

    const dots = [];
    for (let i = 0; i < rows * cols; i++) {
        dots.push(i);
    }

    return (
        <div className={`absolute inset-0 z-0 flex flex-wrap gap-4 p-4 justify-center items-center opacity-20 ${className}`}>
            {dots.map((i) => (
                <motion.div
                    key={i}
                    className="w-1 h-1 rounded-full bg-primary cursor-crosshair"
                    initial={{ opacity: 0.3, scale: 1 }}
                    whileHover={{ opacity: 1, scale: 2.5, backgroundColor: "var(--primary)" }}
                    transition={{ duration: 0.2 }}
                />
            ))}
        </div>
    );
}
