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
  { name: "Weirdough", tier: "" },
  { name: "Atypical Studios", tier: "" },
  { name: "Mavin", tier: "" },
  { name: "Roshd", tier: "" },
  { name: "Barley", tier: "" },
  { name: "The Blanks", tier: "" },
  { name: "Curves", tier: "" },
  { name: "Bobboo", tier: "" },
  { name: "Funday", tier: "" },
  { name: "V7", tier: "" },
  { name: "ASN Protein Bars", tier: "" },
  { name: "Krepe 2000", tier: "" },
  { name: "Halo", tier: "" },
  { name: "SlvrSkn", tier: "" },
  { name: "ameto", tier: "" },
  { name: "Signal", tier: "" },
  { name: "Noi", tier: "" },
  { name: "Clary", tier: "" },
  { name: "Dolicies", tier: "" },
  { name: "Amorino", tier: "" },
  { name: "SAG", tier: "" },
  { name: "ABC Bank", tier: "" },
  { name: "Fawry", tier: "" },
  { name: "Bobaii", tier: "" },
  { name: "Ten Cola", tier: "" },
  { name: "Your PaperShop", tier: "" },
  { name: "Froot World", tier: "" },
  { name: "Long Chips", tier: "" },
  { name: "NoodleStop", tier: "" },
  { name: "Dijaja", tier: "" },
  { name: "Maine", tier: "" },
  { name: "Kippis", tier: "" },
  { name: "Radiance", tier: "" },
  { name: "Dawgs & Shake", tier: "" },
  { name: "20 Grams", tier: "" },
  { name: "Munch & Bunch", tier: "" },
  { name: "Stroop Waffle", tier: "" },
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
