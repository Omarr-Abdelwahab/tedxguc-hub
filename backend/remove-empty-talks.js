import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seed-content.json');

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

// Remove talks 26-48 (the ones without YouTube links)
const initialCount = seed.talks.length;
seed.talks = seed.talks.filter(t => parseInt(t.id) < 26);

console.log(`✅ Removed ${initialCount - seed.talks.length} empty talks from seed file`);
console.log(`📝 Talks remaining: ${seed.talks.length} (IDs 1-25)`);

// Also remove these speakers from events that reference them
const speakersToRemove = [
  'Menna El Naggar', 'Nancy Maher', 'Moaz Akram', 'Gohar Said', 'Roberto Joseph',
  'Mohamed Mohab', 'Amir Roushdy', 'Yara Hesham', 'Sherif El-Sayed', 'Yassin Mahgoub',
  'Haitham Gheita', 'Sohaila Omar', 'Manal Olama', 'Hanaa Medhat', 'Menna Metwally',
  'Raghda Moataz', 'Mamdouh Saud', 'Carmine Cortolano', 'Youssef Mohsen',
  'Ali Aboulnasr', 'Mohamed Rizkallah', 'Sue Ellen Hassouna', 'Carol Hammal'
];

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
