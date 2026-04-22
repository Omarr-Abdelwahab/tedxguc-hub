import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrgTreeSection from "@/components/OrgTreeSection";

const Team = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16 bg-accent">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-4">
            Behind the Ideas
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight mb-6">
            Our <span className="text-primary">Team</span>
          </h1>
          <p className="text-accent-foreground/60 text-lg max-w-2xl mx-auto">
            Meet the curators, executives, and creatives shaping TEDxGUC.
          </p>
        </div>
      </section>

      <OrgTreeSection />

      <Footer />
    </div>
  );
};

export default Team;
