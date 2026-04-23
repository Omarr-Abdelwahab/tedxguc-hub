import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveSeedContentPath = () => {
  const envPath = process.env.SEED_CONTENT_PATH;
  const candidatePaths = [
    envPath,
    path.join(__dirname, "seed-content.json"),
    path.join(process.cwd(), "backend", "seed-content.json"),
    path.join(process.cwd(), "seed-content.json"),
  ].filter(Boolean);

  for (const candidatePath of candidatePaths) {
    if (fs.existsSync(candidatePath)) {
      return candidatePath;
    }
  }

  throw new Error(
    `Unable to locate seed-content.json. Checked: ${candidatePaths.join(", ")}`,
  );
};

const readSeedContent = () => {
  const sourceText = fs.readFileSync(resolveSeedContentPath(), "utf8");
  return JSON.parse(sourceText);
};

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
  const data = readSeedContent();

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

export const loadRawSeedContent = () => readSeedContent();
