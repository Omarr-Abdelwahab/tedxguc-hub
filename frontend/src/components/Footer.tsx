import { useState, type FormEvent } from "react";
import { Instagram, Youtube, Send } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Unable to subscribe right now.");
      }

      setSubscribed(true);
      setEmail("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to subscribe right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-accent text-accent-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Newsletter */}
          <div>
            <h3 className="text-2xl font-black mb-2">Stay in the loop</h3>
            <p className="text-accent-foreground/50 text-sm mb-6">
              Subscribe to get updates on upcoming events and new talks.
            </p>
            {subscribed ? (
              <p className="text-primary font-semibold text-sm">
                ✓ You're subscribed! We'll keep you posted.
              </p>
            ) : (
              <>
                <form onSubmit={handleSubscribe} className="flex gap-0">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-accent-foreground/10 text-accent-foreground placeholder:text-accent-foreground/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground px-6 py-3 font-semibold text-sm uppercase tracking-wider hover:bg-primary/85 transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? "..." : <Send size={16} />}
                  </button>
                </form>
                {errorMessage && (
                  <p className="mt-3 text-sm text-red-400">{errorMessage}</p>
                )}
              </>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", to: "/" },
                { label: "About", to: "/about" },
                { label: "Events", to: "/events" },
                { label: "Talks", to: "/talks" },
                { label: "Upcoming Event", to: "/upcoming" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-accent-foreground/50 text-sm hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social & Brand */}
          <div className="md:text-right">
            <h3 className="text-2xl font-black mb-2">
              <span className="text-primary">TEDx</span>GUC
            </h3>
            <p className="text-accent-foreground/50 text-sm mb-6">
              Ideas worth spreading.
            </p>
            <div className="flex gap-4 md:justify-end">
              {[
                {
                  icon: Instagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/tedxguc__/",
                },
                {
                  icon: Youtube,
                  label: "YouTube",
                  href: "https://www.youtube.com/watch?v=OozzoqEeebs",
                },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 border border-accent-foreground/20 flex items-center justify-center text-accent-foreground/50 hover:text-primary hover:border-primary transition-colors duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-accent-foreground/10 pt-8 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-accent-foreground/30 text-xs">
            © {new Date().getFullYear()} TEDxGUC. This independent TEDx event is
            operated under license from TED.
          </p>
          <p className="text-accent-foreground/30 text-xs">
            TED is a registered trademark of TED Conferences, LLC.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
