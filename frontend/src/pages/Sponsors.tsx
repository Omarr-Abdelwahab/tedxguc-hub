import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Handshake, ArrowRight } from "lucide-react";
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
      <section className="relative pt-32 pb-24 bg-accent overflow-hidden">
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
            Ideas worth supporting
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight leading-[0.95]">
            Our <span className="text-primary">Partners</span>
          </h1>
          <p className="text-accent-foreground/60 mt-6 max-w-xl text-base md:text-lg leading-relaxed">
            The organizations that make TEDxGUC possible — standing alongside us
            to amplify ideas worth spreading.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          {isLoading && (
            <p className="text-center text-muted-foreground py-10">
              Loading partners...
            </p>
          )}
          {errorMessage && (
            <p className="text-center text-destructive py-10">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && (
            <>
              {/* Marquee strip */}
              <div className="relative overflow-hidden border-y-2 border-accent bg-accent mb-20">
                <div className="flex gap-12 py-5 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
                  {[...sponsors, ...sponsors].map((s, i) => (
                    <span
                      key={`${s.name}-${i}`}
                      className="text-accent-foreground/70 text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-12"
                    >
                      {s.name}
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    </span>
                  ))}
                </div>
              </div>

              {/* Card grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {sponsors.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="group relative bg-card border-2 border-border aspect-[4/3] flex flex-col items-center justify-center p-6 overflow-hidden transition-all duration-300 hover:border-primary hover:-translate-y-1"
                  >
                    {/* Corner ticks */}
                    <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
                      <span className="absolute inset-0 border-2 border-primary/20 rotate-45 group-hover:rotate-[55deg] transition-transform duration-500" />
                      <span className="relative text-3xl font-black text-primary">
                        {s.name[0]}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-foreground text-center leading-tight tracking-wide">
                      {s.name}
                    </p>
                    <span className="mt-3 h-[2px] w-6 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <Handshake size={40} className="text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black text-accent-foreground tracking-tight mb-4">
            Partner with TEDxGUC
          </h2>
          <p className="text-accent-foreground/60 mb-8 max-w-xl mx-auto">
            Help us bring bold ideas to the stage. Join a community that believes
            in the power of conversation to spark change.
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
