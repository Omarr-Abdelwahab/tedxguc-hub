import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { submitSpeakerNomination } from "@/lib/api";

const NominateSpeaker = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload = {
      nominatorName: String(formData.get("nominatorName") || "").trim(),
      nominatorEmail: String(formData.get("nominatorEmail") || "").trim(),
      speakerName: String(formData.get("speakerName") || "").trim(),
      speakerEmail: String(formData.get("speakerEmail") || "").trim(),
      speakerTopic: String(formData.get("speakerTopic") || "").trim(),
      speakerBio: String(formData.get("speakerBio") || "").trim(),
      whyNominate: String(formData.get("whyNominate") || "").trim(),
      speakerSocialLinks: String(formData.get("speakerSocialLinks") || "").trim(),
    };

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const result = await submitSpeakerNomination(payload);

      if (!result.ok) {
        throw new Error(result.message || "Unable to submit nomination right now.");
      }

      setSubmitted(true);
      e.currentTarget.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit nomination right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 bg-accent">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-4">
            Share an Idea
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight">
            Nominate a Speaker
          </h1>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          {submitted ? (
            <div className="text-center py-16">
              <p className="text-primary text-4xl font-black mb-4">✓</p>
              <h2 className="text-2xl font-black text-foreground mb-2">
                Nomination Submitted!
              </h2>
              <p className="text-muted-foreground mb-8">
                Thank you for nominating a speaker. We'll review their profile and reach out if they're a great fit for our next event.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Submit Another Nomination
              </button>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
                Know someone with an idea worth spreading? We'd love to hear about them. Fill out the form below to nominate a speaker for our next TEDxGUC event.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nominator Section */}
                <div className="bg-secondary/50 rounded-lg p-6 space-y-4 border border-border">
                  <h3 className="font-bold text-foreground">Your Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="nominatorName"
                        required
                        className="w-full bg-background px-4 py-3 text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="nominatorEmail"
                        required
                        className="w-full bg-background px-4 py-3 text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Speaker Section */}
                <div className="bg-secondary/50 rounded-lg p-6 space-y-4 border border-border">
                  <h3 className="font-bold text-foreground">Speaker Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Speaker Name *
                      </label>
                      <input
                        type="text"
                        name="speakerName"
                        required
                        className="w-full bg-background px-4 py-3 text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Speaker's full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Speaker Email *
                      </label>
                      <input
                        type="email"
                        name="speakerEmail"
                        required
                        className="w-full bg-background px-4 py-3 text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="speaker.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Topic/Area of Expertise *
                    </label>
                    <input
                      type="text"
                      name="speakerTopic"
                      required
                      className="w-full bg-background px-4 py-3 text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Technology, Social Impact, Art & Design"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Speaker Bio/Background *
                    </label>
                    <textarea
                      name="speakerBio"
                      required
                      rows={4}
                      className="w-full bg-background px-4 py-3 text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tell us about the speaker's background, achievements, and areas of expertise"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Why Should They Speak? *
                    </label>
                    <textarea
                      name="whyNominate"
                      required
                      rows={4}
                      className="w-full bg-background px-4 py-3 text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Explain why this person would be a great fit for TEDxGUC and what unique perspective they bring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Social Media Links (LinkedIn, Twitter, etc.)
                    </label>
                    <input
                      type="text"
                      name="speakerSocialLinks"
                      className="w-full bg-background px-4 py-3 text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., linkedin.com/in/speaker or twitter.com/speaker"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                    <p className="text-red-600 text-sm font-semibold">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {isSubmitting ? "Submitting..." : "Submit Nomination"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NominateSpeaker;
