import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seed-content.json');

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

const talkToRemove = 'Music as Medicine';
const speakerToRemove = 'Salma Khaled';

const initialTalkCount = seed.talks.length;

// Remove talk
seed.talks = seed.talks.filter(t => t.title !== talkToRemove);

const talkRemoved = initialTalkCount - seed.talks.length;

console.log(`✅ Removed ${talkRemoved} talk`);
console.log(`📝 Talks remaining: ${seed.talks.length}`);

// Remove speaker from events
seed.events = seed.events.map(event => {
  const initialSpeakers = event.speakers ? event.speakers.length : 0;
  event.speakers = (event.speakers || []).filter(s => s.name !== speakerToRemove);
  if (event.speakers.length < initialSpeakers) {
    console.log(`⚠️ Removed ${initialSpeakers - event.speakers.length} speaker(s) from "${event.theme}"`);
  }
  return event;
});

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf-8');
console.log(`\n✅ Updated seed-content.json`);
