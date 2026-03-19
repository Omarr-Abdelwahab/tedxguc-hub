import { useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TalksSection from "@/components/TalksSection";
import OrgTreeSection from "@/components/OrgTreeSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const talksRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      hero: heroRef,
      talks: talksRef,
      team: teamRef,
      about: aboutRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar onNavigate={scrollTo} />
      <div ref={heroRef}>
        <HeroSection onWatchTalks={() => scrollTo("talks")} />
      </div>
      <div ref={talksRef}>
        <TalksSection />
      </div>
      <div ref={teamRef}>
        <OrgTreeSection />
      </div>
      <div ref={aboutRef}>
        <AboutSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
