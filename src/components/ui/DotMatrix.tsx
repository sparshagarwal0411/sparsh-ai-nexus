import { useEffect, useRef } from "react";

interface DotMatrixProps {
    className?: string;
    dotSize?: number;
    gap?: number;
    glowRadius?: number;
}

export default function DotMatrix({
    className = "",
    dotSize = 1.5,
    gap = 20,
    glowRadius = 90,
}: DotMatrixProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        // Query colors from the CSS variables dynamically
        const rootStyle = getComputedStyle(document.documentElement);
        const primaryColorRaw = rootStyle.getPropertyValue("--primary").trim() || "186 100% 50%";
        const foregroundColorRaw = rootStyle.getPropertyValue("--foreground").trim() || "210 20% 92%";

        const activeColor = `hsl(${primaryColorRaw})`;
        const inactiveColor = `hsl(${foregroundColorRaw})`;

        const resize = () => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            width = rect.width;
            height = rect.height;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };

        resize();

        const resizeObserver = new ResizeObserver(() => {
            resize();
        });
        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        const parent = canvas.parentElement;
        if (parent) {
            parent.addEventListener("mousemove", handleMouseMove);
            parent.addEventListener("mouseleave", handleMouseLeave);
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            const cols = Math.floor(width / gap) + 1;
            const rows = Math.floor(height / gap) + 1;

            const offsetX = (width % gap) / 2;
            const offsetY = (height % gap) / 2;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = c * gap + offsetX;
                    const y = r * gap + offsetY;

                    const dx = mouseRef.current.x - x;
                    const dy = mouseRef.current.y - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    let currentSize = dotSize;

                    if (dist < glowRadius) {
                        const factor = 1 - dist / glowRadius;
                        const easeFactor = Math.pow(factor, 2); // Premium ease curve

                        currentSize = dotSize + easeFactor * dotSize * 2.8;

                        ctx.fillStyle = activeColor;
                        ctx.globalAlpha = 0.2 + easeFactor * 0.8;
                        
                        // Add gorgeous neon glow shadow
                        ctx.shadowColor = activeColor;
                        ctx.shadowBlur = easeFactor * 10;
                    } else {
                        ctx.fillStyle = inactiveColor;
                        ctx.globalAlpha = 0.15; // Subtle background visibility
                        ctx.shadowBlur = 0;
                    }

                    ctx.beginPath();
                    ctx.arc(x, y, currentSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            if (parent) {
                parent.removeEventListener("mousemove", handleMouseMove);
                parent.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    }, [dotSize, gap, glowRadius]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
        />
    );
}
