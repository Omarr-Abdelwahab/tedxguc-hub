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

      {/* Minimal Partner List */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          {isLoading && (
            <p className="text-center text-muted-foreground">Loading partners...</p>
          )}
          {errorMessage && (
            <p className="text-center text-destructive">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && (
            <div className="columns-2 sm:columns-3 md:columns-4 gap-x-10 gap-y-4">
              {sponsors.map((s) => (
                <div
                  key={s.name}
                  className="break-inside-avoid py-2 text-sm md:text-base font-medium text-foreground/80 hover:text-primary transition-colors cursor-default"
                >
                  {s.name}
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
