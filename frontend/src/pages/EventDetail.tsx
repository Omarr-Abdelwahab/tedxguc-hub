import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarDays, MapPin, ArrowLeft } from "lucide-react";
import { fetchEvents, fetchTalks } from "@/lib/api";
import type { TEDxEvent, Talk } from "@/types/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const normalizeRouteParam = (value?: string) => {
  if (!value) {
    return "";
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<TEDxEvent | null>(null);
  const [talks, setTalks] = useState<Talk[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!eventId) {
        if (isMounted) {
          setEvent(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const normalizedEventId = normalizeRouteParam(eventId);
        const [eventsData, talksData] = await Promise.all([
          fetchEvents(),
          fetchTalks(),
        ]);
        if (isMounted) {
          const matchedEvent = eventsData.find((candidate) => {
            return candidate.id === normalizedEventId || encodeURIComponent(candidate.id) === eventId;
          }) || null;
          setEvent(matchedEvent);
          setTalks(talksData);
        }
      } catch {
        if (isMounted) {
          setEvent(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadData();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  if (isLoading) {
    return (
      <div id="main-content" tabIndex={-1} className="min-h-screen">
        <Seo
          title="Loading Event"
          description="Loading TEDxGUC event details."
          path={eventId ? `/events/${encodeURIComponent(eventId)}` : "/events"}
        />
        <Navbar />
        <div className="pt-32 pb-20 text-center text-muted-foreground">Loading event...</div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div id="main-content" tabIndex={-1} className="min-h-screen">
        <Seo
          title="Event Not Found"
          description="The requested TEDxGUC event could not be found."
          path={eventId ? `/events/${encodeURIComponent(eventId)}` : "/events"}
        />
        <Navbar />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-black text-foreground">Event not found</h1>
          <Link to="/events" className="text-primary mt-4 inline-block hover:underline">
            ← Back to Events
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div id="main-content" tabIndex={-1} className="min-h-screen">
      <Seo
        title={event.theme}
        description={event.recap}
        path={eventId ? `/events/${encodeURIComponent(eventId)}` : "/events"}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-accent">
        <div className="container mx-auto px-6">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-accent-foreground/50 hover:text-primary transition-colors text-sm mb-8"
          >
            <ArrowLeft size={16} /> Back to Events
          </Link>
          <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-3">
            {event.season} {event.year}
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight mb-6">
            {event.theme}
          </h1>
          <div className="flex flex-col sm:flex-row gap-6">
            <span className="flex items-center gap-2 text-accent-foreground/60">
              <CalendarDays size={18} className="text-primary" />
              {event.date}
            </span>
            <span className="flex items-center gap-2 text-accent-foreground/60">
              <MapPin size={18} className="text-primary" />
              {event.venue}
            </span>
          </div>
        </div>
      </section>

      {/* Recap */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-2xl font-black text-foreground mb-6">Event Recap</h2>
          <p className="text-foreground/70 leading-relaxed">{event.recap}</p>
        </div>
      </section>

      {/* Speakers */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-2xl font-black text-foreground mb-8">Speakers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.speakers.map((speaker) => {
              const talk = talks.find((t) => t.title === speaker.talkTitle);
              return (
                <div
                  key={speaker.name}
                  className="border-2 border-border bg-background p-5"
                >
                  <p className="font-bold text-foreground">{speaker.name}</p>
                  {talk ? (
                    <Link
                      to={`/talks/${talk.id}`}
                      className="text-sm text-primary hover:underline mt-1 block"
                    >
                      {speaker.talkTitle}
                    </Link>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {speaker.talkTitle}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetail;
