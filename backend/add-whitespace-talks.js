import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedContentPath = path.join(__dirname, "seed-content.json");
const seedContent = JSON.parse(fs.readFileSync(seedContentPath, "utf8"));

// Video data from the messages
const newVideos = [
  {
    videoId: "mOudPoFxALk",
    title: "Beyond limits, different is beautiful",
    speaker: "Rania Abdelaziz & Alaa El Masry",
  },
  {
    videoId: "bq29u6RAp1k",
    title: "", // To be filled
    speaker: "",
  },
  {
    videoId: "for_-b3LyNI",
    title: "",
    speaker: "",
  },
  {
    videoId: "odX9FKx23lI",
    title: "",
    speaker: "",
  },
  {
    videoId: "Qbi4DUmDzcM",
    title: "",
    speaker: "",
  },
  {
    videoId: "Bx3yPK0YdJw",
    title: "",
    speaker: "",
  },
  {
    videoId: "hAVXYHQQyj8",
    title: "",
    speaker: "",
  },
  {
    videoId: "Po9XC1c06Mw",
    title: "",
    speaker: "",
  },
];

// Find the whitespace event
const whitespacEvent = seedContent.events.find(
  (e) => e.theme && e.theme.toLowerCase() === "underconstruction"
);

if (!whitespacEvent) {
  console.log("Available events:");
  seedContent.events.forEach((e) => {
    console.log(`  - ${e.theme} (${e.season} ${e.year})`);
  });
} else {
  console.log("Found event:", whitespacEvent.theme);
  console.log("Current speakers:", whitespacEvent.speakers);
}
