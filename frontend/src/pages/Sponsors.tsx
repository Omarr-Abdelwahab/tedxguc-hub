import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
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
          setErrorMessage("Unable to load sponsors right now.");
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

      <section className="pt-32 pb-20 bg-accent">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-4">
            Our Supporters
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight">
            Partners
          </h1>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          {isLoading && <p className="text-center text-muted-foreground py-10">Loading partners...</p>}
          {errorMessage && <p className="text-center text-destructive py-10">{errorMessage}</p>}

          {!isLoading && !errorMessage && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>}

          <div className="text-center mt-16">
            <p className="text-muted-foreground text-sm mb-4">
              Interested in partnering with TEDxGUC?
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
