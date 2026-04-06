import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const sponsors = [
  { name: "TED", tier: "License Partner" },
  { name: "GUC", tier: "Host University" },
  { name: "Vodafone Egypt", tier: "Gold Sponsor" },
  { name: "Microsoft Egypt", tier: "Gold Sponsor" },
  { name: "Orange Egypt", tier: "Silver Sponsor" },
  { name: "Etisalat Egypt", tier: "Silver Sponsor" },
];

const Sponsors = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 bg-accent">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-4">
            Our Partners
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight">
            Sponsors
          </h1>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((s) => (
              <div
                key={s.name}
                className="border-2 border-border bg-card p-8 text-center hover:border-primary transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-secondary mx-auto mb-4 flex items-center justify-center text-2xl font-black text-primary">
                  {s.name[0]}
                </div>
                <p className="font-bold text-foreground">{s.name}</p>
                <p className="text-xs text-primary uppercase tracking-wider mt-1">
                  {s.tier}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground text-sm mb-4">
              Interested in sponsoring TEDxGUC?
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-primary/85 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sponsors;
