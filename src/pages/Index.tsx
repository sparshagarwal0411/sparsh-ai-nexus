import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import AchievementsSection from "@/components/AchievementsSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Sparsh Agarwal — AI Developer & Civic Tech Builder</title>
        <meta
          name="description"
          content="Portfolio of Sparsh Agarwal – AI Developer, Full-Stack Engineer, and Hackathon Enthusiast. B.Tech ECE at NSUT. Building tech for social impact."
        />
        <meta property="og:title" content="Sparsh Agarwal — AI Developer" />
        <meta
          property="og:description"
          content="AI Developer, Civic Tech Builder, Hackathon Enthusiast. Explore my projects and skills."
        />
        <link rel="canonical" href="https://sparshagarwal.dev" />
      </Helmet>

      <ScrollProgress />
      <Navbar />

      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <AchievementsSection />
        <ContactSection />
      </main>
    </>
  );
};

export default Index;
