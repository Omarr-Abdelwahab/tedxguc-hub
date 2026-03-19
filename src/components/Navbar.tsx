import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onNavigate: (section: string) => void;
}

const Navbar = ({ onNavigate }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Talks", section: "talks" },
    { label: "Our Team", section: "team" },
    { label: "About", section: "about" },
  ];

  const handleClick = (section: string) => {
    onNavigate(section);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-accent/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <button
            onClick={() => onNavigate("hero")}
            className="flex items-center gap-2 group"
          >
            <span className="text-xl font-black tracking-tight text-primary">
              TEDx
            </span>
            <span
              className={`text-xl font-black tracking-tight transition-colors duration-500 ${
                scrolled ? "text-accent-foreground" : "text-foreground"
              }`}
            >
              GUC
            </span>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link.section}
                onClick={() => handleClick(link.section)}
                className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-primary ${
                  scrolled
                    ? "text-accent-foreground/70"
                    : "text-foreground/70"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button className="bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold tracking-wide uppercase transition-all duration-300 hover:bg-primary/85">
              Sign In
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden transition-colors ${
              scrolled ? "text-accent-foreground" : "text-foreground"
            }`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-accent pt-20"
          >
            <div className="flex flex-col items-center gap-8 py-12">
              {links.map((link) => (
                <button
                  key={link.section}
                  onClick={() => handleClick(link.section)}
                  className="text-lg font-semibold uppercase tracking-widest text-accent-foreground/80 hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button className="bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold uppercase tracking-wide">
                Sign In
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
