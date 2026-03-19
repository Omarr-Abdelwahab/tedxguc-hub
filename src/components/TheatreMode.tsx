import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Talk } from "@/data/mockData";

interface TheatreModeProps {
  talk: Talk;
  onClose: () => void;
}

const TheatreMode = ({ talk, onClose }: TheatreModeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-accent/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-accent-foreground/60 hover:text-primary transition-colors"
        >
          <X size={28} />
        </button>

        {/* Video */}
        <div className="w-full aspect-video bg-surface-dark mb-8">
          <iframe
            src={talk.videoUrl}
            title={talk.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Info */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-black text-accent-foreground mb-2">
              {talk.title}
            </h2>
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              {talk.speaker}
            </p>
            <p className="text-accent-foreground/60 text-sm leading-relaxed">
              {talk.speakerBio}
            </p>
          </div>
          <div className="flex md:flex-col gap-3 md:items-end">
            {talk.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                className="text-xs uppercase tracking-wider text-accent-foreground/40 hover:text-primary transition-colors font-medium"
              >
                {link.platform} ↗
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TheatreMode;
