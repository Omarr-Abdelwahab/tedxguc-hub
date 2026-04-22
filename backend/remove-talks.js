import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seed-content.json');

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

const talksToRemove = [
  'The Power of Vulnerability',
  'Rethinking Education in the AI Era',
  'Design Thinking for Social Impact',
  'Breaking the Silence on Mental Health',
  'Sustainable Cities: A Blueprint',
  'The Art of Storytelling',
  'Entrepreneurship in Emerging Markets'
];

const speakersToRemove = [
  'Amira Hassan',
  'Omar El-Sayed',
  'Layla Mansour',
  'Karim Nabil',
  'Nour Abdelrahman',
  'Yasmin Farouk',
  'Ahmed Soliman'
];

const initialTalkCount = seed.talks.length;

// Remove talks
seed.talks = seed.talks.filter(t => !talksToRemove.includes(t.title));

const talkRemoved = initialTalkCount - seed.talks.length;

console.log(`✅ Removed ${talkRemoved} talks`);
console.log(`📝 Talks remaining: ${seed.talks.length}`);

// Remove speakers from events
seed.events = seed.events.map(event => {
  const initialSpeakers = event.speakers ? event.speakers.length : 0;
  event.speakers = (event.speakers || []).filter(s => !speakersToRemove.includes(s.name));
  if (event.speakers.length < initialSpeakers) {
    console.log(`⚠️ Removed ${initialSpeakers - event.speakers.length} speaker(s) from "${event.theme}"`);
  }
  return event;
});

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf-8');
console.log(`\n✅ Updated seed-content.json`);
