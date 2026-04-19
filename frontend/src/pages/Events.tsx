import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { fetchEvents } from "@/lib/api";
import type { TEDxEvent } from "@/types/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Events = () => {
  const [events, setEvents] = useState<TEDxEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [yearFilter, setYearFilter] = useState<number | "">("");

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        if (isMounted) {
          setEvents(data);
        }
      } catch {
        if (isMounted) {
          setErrorMessage("Unable to load events right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const eventYears = useMemo(
    () => [...new Set(events.map((event) => event.year))].sort((a, b) => b - a),
    [events],
  );

  const filtered = yearFilter
    ? events.filter((e) => e.year === yearFilter)
    : events;

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 bg-accent">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-4">
            Archive
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight">
            Past Events
          </h1>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          {/* Year filter */}
          <div className="flex gap-3 mb-12 flex-wrap">
            <button
              onClick={() => setYearFilter("")}
              className={`px-5 py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                yearFilter === ""
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:text-primary"
              }`}
            >
              All
            </button>
            {eventYears.map((y) => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={`px-5 py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  yearFilter === y
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:text-primary"
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Event cards */}
          {isLoading && <p className="text-center text-muted-foreground py-10">Loading events...</p>}
          {errorMessage && <p className="text-center text-red-500 py-10">{errorMessage}</p>}

          {!isLoading && !errorMessage && <div className="space-y-8 max-w-4xl">
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  to={`/events/${event.id}`}
                  className="block border-2 border-border bg-card p-6 md:p-8 hover:border-primary transition-colors duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-2">
                        {event.season} {event.year}
                      </p>
                      <h3 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-primary transition-colors mb-3">
                        {event.theme}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-primary" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin size={14} className="text-primary" />
                          {event.venue}
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      size={24}
                      className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
