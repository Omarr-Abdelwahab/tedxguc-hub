import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchSponsors } from "@/lib/api";
import type { Sponsor } from "@/types/content";

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSponsors = async () => {
      try {
        const data = await fetchSponsors();
        if (isMounted) {
          setSponsors(data);
        }
      } catch {
        if (isMounted) {
          setErrorMessage("Unable to load partners right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSponsors();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-accent overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase text-xs mb-4">
            Ideas worth supporting
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight leading-[0.95]">
            Our <span className="text-primary">Partners</span>
          </h1>
          <p className="text-accent-foreground/60 mt-6 max-w-xl text-base md:text-lg leading-relaxed">
            The organizations that make TEDxGUC possible.
          </p>
        </div>
      </section>

      {/* Partner Grid */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-6 max-w-6xl">
          {isLoading && (
            <p className="text-center text-accent-foreground/50">Loading partners...</p>
          )}
          {errorMessage && (
            <p className="text-center text-primary">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sponsors.map((s, i) => (
                <div
                  key={s.name}
                  className="group relative border border-white/10 bg-white/[0.02] px-6 py-7 transition-all duration-300 hover:border-primary hover:bg-primary/[0.06]"
                >
                  {/* top-left corner tick */}
                  <span className="absolute top-0 left-0 w-3 h-px bg-primary/60 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  <span className="absolute top-0 left-0 h-3 w-px bg-primary/60 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100" />

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-primary/70 tabular-nums leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base md:text-lg font-semibold text-accent-foreground/90 tracking-tight group-hover:text-primary transition-colors duration-300">
                      {s.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent border-t border-border/50">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-black text-accent-foreground tracking-tight mb-4">
            Partner with TEDxGUC
          </h2>
          <p className="text-accent-foreground/60 mb-8 max-w-xl mx-auto">
            Help us bring bold ideas to the stage.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-primary/85 transition-colors group"
          >
            Get in Touch
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sponsors;
