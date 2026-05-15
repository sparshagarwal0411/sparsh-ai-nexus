import { motion } from "framer-motion";
import CinematicCarousel from "./CinematicCarousel";

const projects = [
  {
    title: "WomenPreneur",
    desc: "An empowerment platform connecting women entrepreneurs with resources, mentorship, and community support.",
    tech: ["React", "Tailwind", "Supabase", "Gemini API"],
    live: "https://women-4.vercel.app/",
    github: "https://github.com/sparshagarwal0411/women-4",
    accent: "primary",
    image: "/WomenPreneur.png",
  },
  {
    title: "RoomMate",
    desc: "A smart platform helping users find compatible roommates based on lifestyle preferences and habits.",
    tech: ["React", "Tailwind", "Supabase", "GROQ API"],
    live: "https://roommate-lemon.vercel.app/",
    github: "https://github.com/sparshagarwal0411/roommate",
    accent: "neon-purple",
    image: "/RoomMate.png",
  },
  {
    title: "Jharkhand Eco-Tourism",
    desc: "A digital gateway to Jharkhand's natural beauty, featuring eco-friendly travel guides and booking integration.",
    tech: ["React", "Tailwind", "Node.js", "RAG Scrapper", "Hugging Face"],
    live: "https://sih.adityaexp.dev",
    github: "https://github.com/AvikYadav/Jharkhand-Tourism",
    accent: "neon-purple",
    image: "/jhanrkhand.png",
  },
  {
    title: "CleanWard",
    desc: "Civic-tech app for reporting and tracking cleanliness issues in urban areas, promoting citizen-driven change.",
    tech: ["React", "Firebase", "Tailwind", "Google Maps", "Open Weather API"],
    live: "https://cleanward-1.vercel.app/",
    github: "https://github.com/sparshagarwal0411/cleanward-1",
    accent: "neon-pink",
    image: "/cleanward.jpg",
  },
  {
    title: "UPSC Clone",
    desc: "Comprehensive study portal for innovative learning, offering mock tests and resource tracking for aspirants.",
    tech: ["React", "Vite", "Tailwind", "MongoDB", "Node.js"],
    live: "https://upsc-final-1.vercel.app/",
    github: "https://github.com/sparshagarwal0411/upsc-final",
    accent: "primary",
    image: "/UPSC circle.jpg",
  },
  {
    title: "LinkedIn Profile Reviewer",
    desc: "AI-powered tool that analyzes LinkedIn profiles and provides actionable feedback for optimization.",
    tech: ["React", "Flask", "NLP", "AI"],
    live: "https://linkedin-profile-reviewer-sigma.vercel.app/",
    github: "https://github.com/sparshagarwal0411/linkedin-profile-reviewer",
    accent: "neon-purple",
    image: "/LinkedIn review.png",
  },
  {
    title: "DelhiGrid",
    desc: "Interactive grid-based visualization tool for urban data analysis and resource management.",
    tech: ["React", "Tailwind", "Three.js"],
    live: "https://delhigrid-brokentable.vercel.app/",
    github: "https://github.com/sparshagarwal0411/delhigrid-brokentable",
    accent: "neon-pink",
    image: "/DelhiGrid.png",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative w-screen left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] overflow-hidden">
      {/* Section Title */}
      <div className="relative pt-20 pb-12 px-12 z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto"
        >
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary/60 mb-2">Portfolio</h2>
          <div className="flex items-center gap-4">
            <h3 className="text-4xl md:text-5xl font-black text-white">My Projects</h3>
            <div className="h-[2px] w-24 bg-gradient-to-r from-primary to-transparent" />
          </div>
        </motion.div>
      </div>

      <CinematicCarousel items={projects} />
    </section>
  );
}
