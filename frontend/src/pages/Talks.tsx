import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TalksSection from "@/components/TalksSection";
import Seo from "@/components/Seo";

const Talks = () => {
  return (
    <div id="main-content" tabIndex={-1} className="min-h-screen">
      <Seo
        title="Talks"
        description="Watch TEDxGUC talks from our library of speakers, stories, and ideas worth spreading."
        path="/talks"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-accent overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, hsl(var(--accent-foreground)) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
        <div className="absolute -left-20 top-1/2 w-1 h-32 bg-primary" />
        <div className="container mx-auto px-6 relative">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase text-xs mb-4">
            The TEDxGUC Library
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight leading-[0.95]">
            Talks worth <span className="text-primary">spreading</span>
          </h1>
          <p className="text-accent-foreground/60 mt-6 max-w-xl text-base md:text-lg leading-relaxed">
            Browse every idea that has graced our stage — stories, science,
            sparks of change, all in one place.
          </p>
        </div>
      </section>

      <TalksSection />
      <Footer />
    </div>
  );
};

export default Talks;
