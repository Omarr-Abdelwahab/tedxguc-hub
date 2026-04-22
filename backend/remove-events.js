import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seed-content.json');

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

const initialCount = seed.events.length;

// Remove Uncharted, Mosaic, and duplicate ECHO
seed.events = seed.events.filter(e => {
  if (e.theme === 'Uncharted') return false;
  if (e.theme === 'Mosaic') return false;
  // Keep only the first ECHO event
  if (e.theme === 'ECHO' && e.id === '2024-echo-corrected') return false;
  return true;
});

const removed = initialCount - seed.events.length;

console.log(`✅ Removed ${removed} event(s)`);
console.log(`📅 Events remaining: ${seed.events.length}`);
console.log('\nRemaining events:');
seed.events.forEach((e, i) => {
  console.log(`  ${i + 1}. ${e.theme} (${e.year})`);
});

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf-8');
console.log(`\n✅ Updated seed-content.json`);
