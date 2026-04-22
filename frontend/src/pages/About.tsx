import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-accent">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-4">
            About Us
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight mb-6">
            About <span className="text-primary">TEDx</span>GUC
          </h1>
          <p className="text-accent-foreground/60 text-lg max-w-2xl mx-auto">
            An independently organized TEDx event at the German University in Cairo.
          </p>
        </div>
      </section>

      {/* About TED & TEDx */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-6 text-foreground/70 leading-relaxed">
            <p>
              <strong className="text-foreground">TED</strong> is a nonprofit
              organization devoted to spreading ideas, usually in the form of
              short, powerful talks (18 minutes or less). TED began in 1984 as a
              conference where Technology, Entertainment, and Design converged,
              and today covers almost all topics — from science to business to
              global issues — in more than 100 languages.
            </p>
            <p>
              <strong className="text-foreground">TEDx</strong> events are
              independently organized TED events. The "x" indicates that it is
              an independently organized event — not run by TED directly, but
              licensed by TED under a free license program. TEDx events are
              planned and coordinated independently, on a community-by-community
              basis.
            </p>
            <p>
              <strong className="text-foreground">TEDxGUC</strong> is an
              independently organized TEDx event hosted at the German University
              in Cairo. Our mission is to bring together Egypt's brightest minds
              and most passionate change-makers to share ideas that challenge
              perspectives and inspire action within our community and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-24 bg-accent">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-4">
            The People
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-accent-foreground tracking-tight mb-6">
            Meet the team behind TEDxGUC
          </h2>
          <p className="text-accent-foreground/60 mb-8">
            Discover the curators and executives bringing ideas worth spreading to life.
          </p>
          <Link
            to="/team"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-primary/85 transition-colors"
          >
            View Our Team
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
