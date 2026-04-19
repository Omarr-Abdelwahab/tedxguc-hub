import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, CalendarDays, MapPin, Mic, Users } from "lucide-react";
import { fetchTalks, fetchUpcoming } from "@/lib/api";
import type { Talk, UpcomingEvent } from "@/types/content";
import { AnimatePresence } from "framer-motion";
import TheatreMode from "@/components/TheatreMode";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<UpcomingEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTalk, setSelectedTalk] = useState<Talk | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const [talksData, upcomingData] = await Promise.all([fetchTalks(), fetchUpcoming()]);
        if (!isMounted) {
          return;
        }

        setTalks(talksData);
        setUpcomingEvent(upcomingData.upcomingEvent);
      } catch {
        if (isMounted) {
          setErrorMessage("Unable to load homepage content.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const highlightTalks = useMemo(() => {
    const recent = talks.filter((talk) => talk.year === 2024).slice(0, 6);
    return recent.length > 0 ? recent : talks.slice(0, 6);
  }, [talks]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-accent overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-6">
              Ideas Worth Spreading
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-accent-foreground leading-[0.95] tracking-tight mb-6">
              REDEFINING
              <br />
              <span className="text-primary">TOMORROW</span>
            </h1>
            <p className="text-accent-foreground/60 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light">
              TEDxGUC brings together visionary thinkers, creators, and
              change-makers to spark conversations that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:bg-primary/85 hover:gap-5"
              >
                Previous Events
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/upcoming"
                className="inline-flex items-center gap-3 border-2 border-accent-foreground/30 text-accent-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:border-primary hover:text-primary"
              >
                Join Waitlist
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="w-24 h-1 bg-primary mx-auto mt-16 origin-left"
          />
        </div>
      </section>

      {/* Next Event Hero Card */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto border-2 border-border bg-card p-8 md:p-12">
            <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-4">
              Next Event
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-4">
              {upcomingEvent?.theme || "Upcoming"}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
              {upcomingEvent?.description || "Event details will be announced soon."}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <div className="flex items-center gap-3 text-foreground">
                <CalendarDays size={20} className="text-primary" />
                <span className="text-sm font-medium">{upcomingEvent?.date || "TBA"}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <MapPin size={20} className="text-primary" />
                <span className="text-sm font-medium">{upcomingEvent?.venue || "TBA"}</span>
              </div>
            </div>
            <Link
              to="/upcoming"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:bg-primary/85"
            >
              View Details <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* What is TEDx? */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-3">
            About the Program
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-8">
            What is TEDx?
          </h2>
          <p className="text-foreground/70 leading-relaxed mb-4">
            In the spirit of TED's mission — ideas worth spreading — TEDx is a
            program of local, self-organized events that bring people together to
            share a TED-like experience. At a TEDx event, TED Talks videos and
            live speakers combine to spark deep discussion and connection.
          </p>
          <p className="text-foreground/70 leading-relaxed mb-8">
            TEDxGUC is an independently organized TEDx event at the German
            University in Cairo, bringing Egypt's brightest minds together to
            challenge perspectives and inspire action.
          </p>
          <a
            href="https://www.ted.com/about/programs-initiatives/tedx-program"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold text-sm uppercase tracking-wider hover:underline"
          >
            Learn more about the TED<span className="text-xs">x</span> program →
          </a>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-3">
              From Our Last Event
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Highlights
            </h2>
          </div>
          {isLoading && <p className="text-center text-muted-foreground py-10">Loading highlights...</p>}
          {errorMessage && <p className="text-center text-red-500 py-10">{errorMessage}</p>}

          {!isLoading && !errorMessage && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {highlightTalks.map((talk, i) => (
              <motion.div
                key={talk.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group cursor-pointer"
                onClick={() => setSelectedTalk(talk)}
              >
                <div className="relative overflow-hidden bg-secondary">
                  <img
                    src={talk.thumbnail}
                    alt={talk.title}
                    className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-primary-foreground text-xl ml-1">▶</span>
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-accent/80 text-accent-foreground text-xs font-medium px-2 py-1">
                    {talk.duration}
                  </span>
                </div>
                <div className="pt-4">
                  <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {talk.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {talk.speaker}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>}
          <div className="text-center mt-12">
            <Link
              to="/talks"
              className="text-primary font-semibold text-sm uppercase tracking-wider hover:underline"
            >
              View All Talks →
            </Link>
          </div>
        </div>
      </section>

      {/* Nominate / Volunteer CTAs */}
      <section className="py-24 bg-accent">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border-2 border-accent-foreground/20 p-8 text-center">
              <Mic size={36} className="text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-black text-accent-foreground mb-3">
                Nominate a Speaker
              </h3>
              <p className="text-accent-foreground/50 text-sm mb-6">
                Know someone with an idea worth spreading? Nominate them for our
                next event.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-primary/85 transition-colors"
              >
                Nominate <ArrowRight size={16} />
              </Link>
            </div>
            <div className="border-2 border-accent-foreground/20 p-8 text-center">
              <Users size={36} className="text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-black text-accent-foreground mb-3">
                Volunteer With Us
              </h3>
              <p className="text-accent-foreground/50 text-sm mb-6">
                Be part of the team that makes TEDxGUC happen. Join us as a
                volunteer for the next season.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-primary/85 transition-colors"
              >
                Apply <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {selectedTalk && (
          <TheatreMode
            talk={selectedTalk}
            onClose={() => setSelectedTalk(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
