import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seed-content.json');

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

// Remove placeholder video URLs and thumbnails from talks 26-48
const talksToClean = seed.talks.filter(t => parseInt(t.id) >= 26 && parseInt(t.id) <= 48);

talksToClean.forEach(talk => {
  talk.videoUrl = '';
  talk.thumbnail = '';
});

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf-8');

console.log(`✅ Removed placeholder video URLs and thumbnails from ${talksToClean.length} talks`);
console.log(`📝 Talks cleaned: IDs 26-48`);
console.log(`\n⚠️ These talks now have empty video URLs. When you have the actual YouTube links, update them accordingly.`);
