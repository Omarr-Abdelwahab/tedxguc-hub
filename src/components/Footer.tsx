import { useState } from "react";
import { Instagram, Linkedin, Youtube, Send } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-accent text-accent-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
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
              <form
                onSubmit={handleSubscribe}
                className="flex gap-0"
              >
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
                  className="bg-primary text-primary-foreground px-6 py-3 font-semibold text-sm uppercase tracking-wider hover:bg-primary/85 transition-colors flex items-center gap-2"
                >
                  <Send size={16} />
                </button>
              </form>
            )}
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
                { icon: Instagram, label: "Instagram" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
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
