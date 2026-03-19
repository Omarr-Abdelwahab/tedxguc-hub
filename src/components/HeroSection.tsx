import { motion } from "framer-motion";

interface HeroSectionProps {
  onWatchTalks: () => void;
}

const HeroSection = ({ onWatchTalks }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-accent overflow-hidden">
      {/* Subtle grid overlay */}
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
            TEDxGUC brings together visionary thinkers, creators, and change-makers
            to spark conversations that matter.
          </p>
          <button
            onClick={onWatchTalks}
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:bg-primary/85 hover:gap-5"
          >
            Watch Latest Talks
            <span className="text-lg">→</span>
          </button>
        </motion.div>

        {/* Decorative red bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="w-24 h-1 bg-primary mx-auto mt-16 origin-left"
        />
      </div>
    </section>
  );
};

export default HeroSection;
