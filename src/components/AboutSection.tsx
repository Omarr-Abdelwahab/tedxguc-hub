const AboutSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="mb-12 text-center">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-3">
            Brand Compliance
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            About TEDx
          </h2>
        </div>

        <div className="space-y-6 text-foreground/70 leading-relaxed text-sm">
          <p>
            <strong className="text-foreground">TED</strong> is a nonprofit
            organization devoted to spreading ideas, usually in the form of
            short, powerful talks (18 minutes or less). TED began in 1984 as a
            conference where Technology, Entertainment, and Design converged, and
            today covers almost all topics — from science to business to global
            issues — in more than 100 languages.
          </p>
          <p>
            <strong className="text-foreground">TEDx</strong> events are
            independently organized TED events. The "x" indicates that it is an
            independently organized event — not run by TED directly, but
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
          <div className="w-12 h-1 bg-primary mx-auto mt-8" />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
