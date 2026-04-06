import { useState } from "react";
import { CalendarDays, MapPin, ChevronDown, Clock, Mic, Coffee, Zap } from "lucide-react";
import { motion } from "framer-motion";
import {
  upcomingEvent,
  upcomingSchedule,
  upcomingFAQs,
  upcomingSpeakers,
} from "@/data/mockData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Upcoming = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-accent">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-4">
            Upcoming Event
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-accent-foreground tracking-tight mb-4">
            {upcomingEvent.theme}
          </h1>
          <p className="text-accent-foreground/60 text-lg max-w-2xl mx-auto mb-8">
            {upcomingEvent.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
            <span className="flex items-center gap-2 text-accent-foreground/60 justify-center">
              <CalendarDays size={18} className="text-primary" />
              {upcomingEvent.date}
            </span>
            <span className="flex items-center gap-2 text-accent-foreground/60 justify-center">
              <MapPin size={18} className="text-primary" />
              {upcomingEvent.venue}
            </span>
          </div>
          <button className="bg-primary text-primary-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-primary/85 transition-colors">
            Join the Waitlist
          </button>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-3">
              Plan Your Day
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Schedule
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-0">
              {upcomingSchedule.map((item, i) => {
                const Icon =
                  item.type === "talk"
                    ? Mic
                    : item.type === "break"
                    ? Coffee
                    : Zap;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="relative pl-16 pb-10"
                  >
                    {/* Dot */}
                    <div className="absolute left-[17px] top-1 w-[18px] h-[18px] border-2 border-primary bg-background flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary" />
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-primary font-bold text-sm min-w-[50px]">
                        {item.time}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={14} className="text-primary" />
                          <h3 className="text-sm font-bold text-foreground">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-3">
              On Stage
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Speakers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingSpeakers.map((speaker, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border-2 border-border bg-background p-6 text-center"
              >
                <div className="w-16 h-16 bg-secondary border-2 border-border mx-auto mb-4 flex items-center justify-center">
                  <Mic size={24} className="text-muted-foreground" />
                </div>
                <p className="font-bold text-foreground">{speaker.name}</p>
                <p className="text-xs text-primary uppercase tracking-wider mt-1">
                  {speaker.topic}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-3">
              Questions?
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              FAQ
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {upcomingFAQs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-2 border-border bg-card px-6"
              >
                <AccordionTrigger className="text-sm font-bold text-foreground hover:text-primary transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Upcoming;
