import { useState } from "react";
import { Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 bg-accent">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-4">
            Get in Touch
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight">
            Contact Us
          </h1>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-xl">
          {submitted ? (
            <div className="text-center py-16">
              <p className="text-primary text-4xl font-black mb-4">✓</p>
              <h2 className="text-2xl font-black text-foreground mb-2">
                Message Sent!
              </h2>
              <p className="text-muted-foreground">
                We'll get back to you as soon as possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-secondary px-4 py-3 text-foreground text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-secondary px-4 py-3 text-foreground text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Subject
                </label>
                <select className="w-full bg-secondary px-4 py-3 text-foreground text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                  <option>General Inquiry</option>
                  <option>Speaker Nomination</option>
                  <option>Volunteer Application</option>
                  <option>Sponsorship</option>
                  <option>Media & Press</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  className="w-full bg-secondary px-4 py-3 text-foreground text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Tell us what's on your mind..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold uppercase tracking-widest hover:bg-primary/85 transition-colors flex items-center justify-center gap-2"
              >
                Send Message <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
