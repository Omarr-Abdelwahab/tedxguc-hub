import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedContentPath = path.join(__dirname, "seed-content.json");

export const contactSubjects = [
  "General Inquiry",
  "Speaker Nomination",
  "Volunteer Application",
  "Partnership",
  "Media & Press",
];

export const sponsors = [
  { name: "TED", tier: "License Partner" },
  { name: "GUC", tier: "Host University" },
  { name: "Ameto", tier: "Gold Sponsor" },
  { name: "V7", tier: "Gold Sponsor" },
  { name: "Crepe 2000", tier: "Silver Sponsor" },
  { name: "HagmaxLama", tier: "Silver Sponsor" },
];

export const loadSiteContent = () => {
  const sourceText = fs.readFileSync(seedContentPath, "utf8");
  const data = JSON.parse(sourceText);

  return {
    contactSubjects: data.contactSubjects || contactSubjects,
    sponsors: data.sponsors || sponsors,
    talks: data.talks,
    orgTreesBySeason: data.orgTreesBySeason,
    events: data.events,
    upcomingEvent: data.upcomingEvent,
    upcomingSchedule: data.upcomingSchedule,
    upcomingFAQs: data.upcomingFAQs,
    upcomingSpeakers: data.upcomingSpeakers,
  };
};
