import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Team", to: "/team" },
    { label: "Events", to: "/events" },
    { label: "Talks", to: "/talks" },
    { label: "Partners", to: "/partners" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-accent/95 backdrop-blur-md shadow-lg"
            : "bg-accent/80 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center gap-0 group">
            <span className="text-xl font-black tracking-tight text-primary">
              TEDx
            </span>
            <span
              className={`text-xl font-black tracking-tight transition-colors duration-500 text-accent-foreground`}
            >
            GUC
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-primary ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-accent-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/upcoming"
              className="bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold tracking-wide uppercase transition-all duration-300 hover:bg-primary/85"
            >
              Join Waitlist
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden transition-colors text-accent-foreground`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

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
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-lg font-semibold uppercase tracking-widest hover:text-primary transition-colors ${
                    location.pathname === link.to
                      ? "text-primary"
                      : "text-accent-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/upcoming"
                onClick={() => setMobileOpen(false)}
                className="bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold uppercase tracking-wide"
              >
                Join Waitlist
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
