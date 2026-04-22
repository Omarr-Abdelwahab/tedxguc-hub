import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "data", "tedxguc.sqlite");
const seedContentPath = path.join(__dirname, "seed-content.json");

// Open database
const db = new Database(dbPath);

// Read seed content
const seedContent = JSON.parse(fs.readFileSync(seedContentPath, "utf8"));
const talks = seedContent.talks;

// Update talks in database
const updateTalks = db.prepare(`
  UPDATE content_items 
  SET payload = @payload, updated_at = @updatedAt
  WHERE key = 'talks'
`);

updateTalks.run({
  payload: JSON.stringify(talks),
  updatedAt: new Date().toISOString(),
});

console.log(`✓ Updated ${talks.length} talks in the database`);
talks.forEach((talk) => {
  console.log(`  - ${talk.id}: ${talk.title} by ${talk.speaker}`);
});

db.close();
