import { useState, useMemo } from "react";
import { Search, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { talks, topics, years, Talk } from "@/data/mockData";
import TheatreMode from "./TheatreMode";

const TalksSection = () => {
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [yearFilter, setYearFilter] = useState<number | "">("");
  const [selectedTalk, setSelectedTalk] = useState<Talk | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return talks.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.speaker.toLowerCase().includes(search.toLowerCase());
      const matchTopic = !topicFilter || t.topic === topicFilter;
      const matchYear = !yearFilter || t.year === yearFilter;
      return matchSearch && matchTopic && matchYear;
    });
  }, [search, topicFilter, yearFilter]);

  const toggleFav = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-3">
            Explore
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            All Talks
          </h2>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search talks or speakers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-secondary border-none text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="px-4 py-3 bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={yearFilter}
            onChange={(e) =>
              setYearFilter(e.target.value ? Number(e.target.value) : "")
            }
            className="px-4 py-3 bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((talk, i) => (
            <motion.div
              key={talk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
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
              <div className="pt-4 flex gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-foreground leading-snug truncate group-hover:text-primary transition-colors">
                    {talk.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {talk.speaker}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {talk.topic} · {talk.year}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFav(talk.id);
                  }}
                  className="flex-shrink-0 mt-0.5"
                >
                  <Heart
                    size={18}
                    className={`transition-colors ${
                      favorites.has(talk.id)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            No talks found matching your filters.
          </p>
        )}
      </div>

      {/* Theatre Mode */}
      <AnimatePresence>
        {selectedTalk && (
          <TheatreMode
            talk={selectedTalk}
            onClose={() => setSelectedTalk(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default TalksSection;
