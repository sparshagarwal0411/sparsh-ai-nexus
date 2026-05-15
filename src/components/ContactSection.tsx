import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import { Mail, Github, Linkedin, MapPin, Instagram } from "lucide-react";
import ContactForm from "./ContactForm";

const socials = [
  {
    icon: Mail,
    label: "Email",
    href: "mailto:sparshagarwal0411@gmail.com",
    value: "sparshagarwal0411@gmail.com",
  },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/sparshagarwal0411",
    value: "sparshagarwal0411",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/sparshagarwal0411",
    value: "Sparsh Agarwal",
  },
  {
    icon: Instagram, // Use Lucide icon, make sure to import it
    label: "Instagram",
    href: "https://www.instagram.com/sparshagarwal0411/",
    value: "@sparshagarwal0411",
  }
];

export default function ContactSection() {
  return (
    <SectionWrapper id="contact" title="Get In Touch" subtitle="Let's build something amazing together">
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">

        {/* Left Column: Contact Info */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a project in mind or just want to chat? I'm currently open to new opportunities and collaborations.
            </p>

            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin size={20} className="text-primary" />
              <span>New Delhi, India</span>
            </div>
          </motion.div>

          <div className="space-y-4">
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target={s.label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 6 }}
                className="flex items-center gap-4 glass rounded-xl p-5 neon-border hover:neon-glow-box transition-all duration-300 group"
              >
                <s.icon size={22} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p className="text-foreground text-sm font-medium">{s.value}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-8 neon-border relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <h3 className="text-xl font-bold mb-6 gradient-text">Send Message</h3>
          <ContactForm />
        </motion.div>

      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center text-muted-foreground text-xs font-mono mt-20"
      >
        Designed & built by Sparsh Agarwal © {new Date().getFullYear()}
      </motion.p>
    </SectionWrapper>
  );
}
