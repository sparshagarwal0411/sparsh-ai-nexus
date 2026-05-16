import { motion } from "framer-motion";
import { ReactNode } from "react";
import ScrambleText from "./ui/ScrambleText";

interface Props {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, title, subtitle, children, className = "" }: Props) {
  return (
    <section id={id} className={`py-24 md:py-32 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 gradient-text inline-block tracking-tight">
            <ScrambleText text={title} />
          </h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground max-w-xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
