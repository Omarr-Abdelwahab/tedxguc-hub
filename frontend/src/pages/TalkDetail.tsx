import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { fetchTalks } from "@/lib/api";
import type { Talk } from "@/types/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

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
      <div id="main-content" tabIndex={-1} className="min-h-screen">
        <Seo
          title="Loading Talk"
          description="Loading TEDxGUC talk details."
          path={talkId ? `/talks/${encodeURIComponent(talkId)}` : "/talks"}
        />
        <Navbar />
        <div className="pt-32 pb-20 text-center text-muted-foreground">Loading talk...</div>
        <Footer />
      </div>
    );
  }

  if (!talk) {
    return (
      <div id="main-content" tabIndex={-1} className="min-h-screen">
        <Seo
          title="Talk Not Found"
          description="The requested TEDxGUC talk could not be found."
          path={talkId ? `/talks/${encodeURIComponent(talkId)}` : "/talks"}
        />
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
    <div id="main-content" tabIndex={-1} className="min-h-screen">
      <Seo
        title={talk.title}
        description={talk.speakerBio}
        path={talkId ? `/talks/${encodeURIComponent(talkId)}` : "/talks"}
      />
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
            TEDxGUC
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-lg font-bold text-foreground uppercase tracking-widest mb-4">Speaker</h1>
          <h3 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">{talk.speaker}</h3>
          <p className="text-foreground/70 leading-relaxed text-base mb-8">{talk.speakerBio}</p>
          
          {talk.socialLinks && talk.socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-6 mt-8">
              {talk.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors uppercase tracking-wide"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TalkDetail;
