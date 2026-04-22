import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seed-content.json');

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

const speakersToRemove = [
  'Abdelrahman Ghareeb',
  'Aida Shaaban',
  'Rami Hamdi'
];

// Find and update Whitespace event
const whitespaceEvent = seed.events.find(e => e.theme === 'Whitespace');

if (whitespaceEvent) {
  const initialCount = whitespaceEvent.speakers.length;
  whitespaceEvent.speakers = whitespaceEvent.speakers.filter(s => !speakersToRemove.includes(s.name));
  const removed = initialCount - whitespaceEvent.speakers.length;
  
  console.log(`✅ Removed ${removed} speaker(s) from Whitespace event`);
  console.log(`📝 Speakers remaining: ${whitespaceEvent.speakers.length}`);
  console.log('\nRemaining speakers:');
  whitespaceEvent.speakers.forEach(s => {
    console.log(`   - ${s.name} (${s.talkTitle})`);
  });
} else {
  console.log('❌ Whitespace event not found');
}

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf-8');
console.log(`\n✅ Updated seed-content.json`);
