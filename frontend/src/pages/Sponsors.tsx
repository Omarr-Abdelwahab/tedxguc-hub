import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchSponsors } from "@/lib/api";
import type { Sponsor } from "@/types/content";
import Seo from "@/components/Seo";

const sponsorInstagramLinks: Record<string, string> = {
  "Atypical Studios": "https://www.instagram.com/atypicalstudios.co",
  Mavin: "https://www.instagram.com/mavinwear",
  Roshd: "https://www.instagram.com/roshd.eg/",
  Barley: "https://www.instagram.com/by.barely/?hl=en",
  "The Blanks": "https://www.instagram.com/theblanks.clo/",
  Curves: "https://www.instagram.com/curves.eg",
  "V7": "https://www.instagram.com/v7egypt",
  "ASN Protein Bars": "https://www.instagram.com/asn.egypt/",
  "Krepe 2000": "https://www.instagram.com/crepe.2000/",
  Halo: "https://www.instagram.com/halo.snacks",
  SlvrSkn: "https://www.instagram.com/slvrskncoffee/",
  ameto: "https://www.instagram.com/ameto.eg",
  Signal: "https://www.instagram.com/signalegypt/",
  Noi: "https://www.instagram.com/noi.eg/",
  Clary: "https://www.instagram.com/claryegypt/",
  Amorino: "https://www.instagram.com/amorinoegypt",
  SAG: "https://www.instagram.com/mgsagautomotive/",
  "ABC Bank": "https://www.instagram.com/bankabc.eg/",
  Fawry: "https://www.instagram.com/fawrypayments/",
  Bobaii: "https://www.instagram.com/bobai_suncare/",
  "Ten Cola": "https://www.instagram.com/tencola10/",
  "Your PaperShop": "https://www.instagram.com/yourpapershopeg/",
  "Froot World": "https://www.instagram.com/froot.world/",
  "Long Chips": "https://www.instagram.com/longchipsegypt/",
  NoodleStop: "https://www.instagram.com/noodles.stop/",
  Dijaja: "https://www.instagram.com/dijaja.eg/",
  "Maine": "https://www.instagram.com/maineegypt/",
  Kippis: "https://www.instagram.com/kippiseg/",
  Radiance: "https://www.instagram.com/radiancemedcenter/",
  "Dawgs & Shake": "https://www.instagram.com/dawgsnshakes.eg/",
  "20 Grams": "https://www.instagram.com/20grams_eg/",
  "Munch & Bunch": "https://www.instagram.com/munchandshake/",
  "Weirdough": "https://www.instagram.com/itsweirdough/",
};

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
    <div id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground">
      <Seo
        title="Partners"
        description="Meet the partners and sponsors that help TEDxGUC bring bold ideas to the stage."
        path="/partners"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-accent overflow-hidden">
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
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          {isLoading && (
            <p className="text-center text-muted-foreground">Loading partners...</p>
          )}
          {errorMessage && (
            <p className="text-center text-primary">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sponsors.map((s, i) => (
                <div
                  key={s.name}
                  className="group relative border-2 border-border bg-card px-6 py-7 transition-colors duration-300 hover:border-primary"
                >
                  {/* top-left corner tick */}
                  <span className="absolute top-0 left-0 w-3 h-px bg-primary/60 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  <span className="absolute top-0 left-0 h-3 w-px bg-primary/60 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100" />

                  <div className="flex items-center gap-4">
                    {sponsorInstagramLinks[s.name] ? (
                      <a
                        href={sponsorInstagramLinks[s.name]}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-base md:text-lg font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300"
                      >
                        {s.name}
                      </a>
                    ) : (
                      <span className="text-base md:text-lg font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                        {s.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-accent border-t border-accent-foreground/10">
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
