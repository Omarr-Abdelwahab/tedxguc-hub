import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { fetchTalks } from "@/lib/api";
import type { Talk } from "@/types/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TalkDetail = () => {
  const { talkId } = useParams();
  const [talk, setTalk] = useState<Talk | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadTalk = async () => {
      if (!talkId) {
        if (isMounted) {
          setTalk(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const talks = await fetchTalks();
        const foundTalk = talks.find((t) => t.id === talkId);
        if (isMounted) {
          setTalk(foundTalk || null);
        }
      } catch {
        if (isMounted) {
          setTalk(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTalk();
    return () => {
      isMounted = false;
    };
  }, [talkId]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 text-center text-muted-foreground">Loading talk...</div>
        <Footer />
      </div>
    );
  }

  if (!talk) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-black text-foreground">Talk not found</h1>
          <Link to="/talks" className="text-primary mt-4 inline-block hover:underline">
            ← Back to Talks
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-accent">
        <div className="container mx-auto px-6">
          <Link
            to="/talks"
            className="inline-flex items-center gap-2 text-accent-foreground/50 hover:text-primary transition-colors text-sm mb-8"
          >
            <ArrowLeft size={16} /> Back to Talks
          </Link>
          <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-3">
            {talk.topic} · {talk.year}
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight mb-6">
            {talk.title}
          </h1>
          <p className="text-xl text-accent-foreground/80">By {talk.speaker}</p>
        </div>
      </section>

      {/* Video */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="aspect-video bg-secondary">
            <iframe
              src={talk.videoUrl}
              title={talk.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </section>

      {/* Speaker Info */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-2xl font-black text-foreground mb-6">About the Speaker</h2>
          <div className="border-2 border-border bg-background p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">{talk.speaker}</h3>
            <p className="text-foreground/70 leading-relaxed mb-6">{talk.speakerBio}</p>
            {talk.socialLinks && talk.socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {talk.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    {link.platform}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Talk Details */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border-2 border-border bg-secondary p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Duration
              </p>
              <p className="text-xl font-bold text-foreground">{talk.duration}</p>
            </div>
            <div className="border-2 border-border bg-secondary p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Topic
              </p>
              <p className="text-xl font-bold text-foreground">{talk.topic}</p>
            </div>
            <div className="border-2 border-border bg-secondary p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Year
              </p>
              <p className="text-xl font-bold text-foreground">{talk.year}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TalkDetail;
