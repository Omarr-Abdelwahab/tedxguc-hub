import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seed-content.json');

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

// Get current max ID
const maxId = Math.max(...seed.talks.map(t => parseInt(t.id)));

// New talks data organized by event
const newTalksData = {
  'pillars': [
    { speaker: 'Menna El Naggar', title: 'The Human Experience : Stories that heal, inspire and transform', topic: 'Human Sciences', year: 2025 },
    { speaker: 'Nancy Maher', title: 'The pillars within : simulated connection, real disconnection', topic: 'Psychology', year: 2025 },
    { speaker: 'Moaz Akram', title: 'The points you never knew you were scoring', topic: 'Personal Development', year: 2025 },
    { speaker: 'Gohar Said', title: 'Entrepreneurship\'s silent battles: the unfiltered truth', topic: 'Business', year: 2025 },
    { speaker: 'Roberto Joseph', title: 'Signed out to sign in', topic: 'Technology & Society', year: 2025 }
  ],
  'glitch': [
    { speaker: 'Mohamed Mohab', title: 'From 1 to 8 Billion: How a single idea evolved into a global tech ecosystem', topic: 'Technology', year: 2024 },
    { speaker: 'Amir Roushdy', title: 'From skepticism to Reality', topic: 'Science', year: 2024 },
    { speaker: 'Yara Hesham', title: 'The unspoken impact of our commuting choices', topic: 'Environment & Society', year: 2024 },
    { speaker: 'Sherif El-Sayed', title: 'Not just words: Language and Emotions, a Complex Relationship that affects our daily life', topic: 'Psychology', year: 2024 },
    { speaker: 'Yassin Mahgoub', title: 'Cracking the code: How technology is driving medical progress', topic: 'Health & Technology', year: 2024 },
    { speaker: 'Haitham Gheita', title: 'Grow through what you go through', topic: 'Personal Development', year: 2024 },
    { speaker: 'Sohaila Omar', title: 'Ancient Traditions in modern lives: A journey through time', topic: 'Culture & Society', year: 2024 },
    { speaker: 'Manal Olama', title: 'The white T-shirt crisis: Exploring the fashion revolution', topic: 'Sustainability & Fashion', year: 2024 }
  ],
  'echo': [
    { speaker: 'Hanaa Medhat', title: 'Words That Matter', topic: 'Communication', year: 2024 },
    { speaker: 'Menna Metwally', title: 'The Echo of Our Choices', topic: 'Philosophy', year: 2024 },
    { speaker: 'Raghda Moataz', title: 'Narratives That Shape Us', topic: 'Culture', year: 2024 },
    { speaker: 'Mamdouh Saud', title: 'Resonance in a Noisy World', topic: 'Human Connection', year: 2024 }
  ],
  'allThatGlitters': [
    { speaker: 'Carmine Cortolano', title: 'Not All That Glitters: Seeing Through Illusions', topic: 'Philosophy', year: 2021 },
    { speaker: 'Youssef Mohsen', title: 'The Hidden Value in Overlooked Things', topic: 'Personal Development', year: 2021 }
  ],
  'backAndForth': [
    { speaker: 'Ali Aboulnasr', title: 'Goal Of Equality', topic: 'Social Justice', year: 2015 },
    { speaker: 'Mohamed Rizkallah', title: 'STEM-ED', topic: 'Education & Technology', year: 2015 },
    { speaker: 'Sue Ellen Hassouna', title: 'Criminals in Suits', topic: 'Business Ethics', year: 2015 },
    { speaker: 'Carol Hammal', title: 'Art therapy: a world beyond creative expression', topic: 'Health & Arts', year: 2015 }
  ]
};

// Create new talk objects
let talkId = maxId + 1;
const talkIdMap = {}; // Map to track which talks belong to which event

Object.entries(newTalksData).forEach(([eventKey, talks]) => {
  talkIdMap[eventKey] = [];
  talks.forEach(talkData => {
    const newTalk = {
      id: String(talkId),
      title: talkData.title,
      speaker: talkData.speaker,
      speakerBio: `${talkData.speaker} is a thought leader and speaker at TEDxGUC.`,
      topic: talkData.topic,
      year: talkData.year,
      duration: '14:00',
      thumbnail: `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 12)}?w=640&h=360&fit=crop`,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      socialLinks: []
    };
    seed.talks.push(newTalk);
    talkIdMap[eventKey].push(newTalk);
    talkId++;
  });
});

// Helper to generate event ID
const genEventId = (theme, year) => `${year}-${theme.toLowerCase().replace(/\s+/g, '')}`;

// Create/update events
const newEvents = [
  {
    id: genEventId('The Pillars of Everything', 2025),
    year: 2025,
    season: 'Spring',
    theme: 'The Pillars of Everything',
    date: 'May 17, 2025',
    venue: 'GUC Main Auditorium, New Cairo',
    recap: 'TEDxGUC "The Pillars of Everything" explored the silent convictions, formative experiences, and moments that hold us together when everything else shifts. In a world obsessed with outcomes, we often overlook what lies beneath.',
    speakers: talkIdMap['pillars'].map(talk => ({
      name: talk.speaker,
      talkTitle: talk.title,
      topic: talk.topic
    })),
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop'
    ],
    sponsors: ['TED', 'GUC']
  },
  {
    id: genEventId('Glitch', 2024),
    year: 2024,
    season: 'Fall',
    theme: 'Glitch',
    date: 'September 28, 2024',
    venue: 'GUC Conference Center, New Cairo',
    recap: 'TEDxGUC "Glitch" explored unexpected disruptions in our digital and physical worlds. From technological malfunctions to societal upheavals, glitches can be both destructive and transformative.',
    speakers: talkIdMap['glitch'].map(talk => ({
      name: talk.speaker,
      talkTitle: talk.title,
      topic: talk.topic
    })),
    gallery: [
      'https://images.unsplash.com/photo-1519915212116-7cfef71f1b0a?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop'
    ],
    sponsors: ['TED', 'GUC']
  },
  {
    id: genEventId('ECHO', 2024),
    year: 2024,
    season: 'Spring',
    theme: 'ECHO',
    date: 'May 17, 2024',
    venue: 'GUC Main Auditorium, New Cairo',
    recap: 'Beyond the echoes of faint whispers and symphonies of words lies a million untold narratives. TEDxGUC ECHO explores the impact of words and opinions, posing the question: Will we separate the souls, artists and personalities from the opinions or will cancel culture thrive?',
    speakers: talkIdMap['echo'].map(talk => ({
      name: talk.speaker,
      talkTitle: talk.title,
      topic: talk.topic
    })),
    gallery: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop'
    ],
    sponsors: ['TED', 'GUC']
  },
  {
    id: genEventId('All that glitters', 2021),
    year: 2021,
    season: 'Fall',
    theme: 'All that glitters',
    date: 'September 18, 2021',
    venue: 'GUC Main Auditorium, New Cairo',
    recap: 'All that glitters is not gold. This event challenged perspectives on appearances and true value, exploring the lessons learned from both shiny surfaces and overlooked treasures.',
    speakers: talkIdMap['allThatGlitters'].map(talk => ({
      name: talk.speaker,
      talkTitle: talk.title,
      topic: talk.topic
    })),
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop'
    ],
    sponsors: ['TED', 'GUC']
  },
  {
    id: genEventId('Back & forth', 2015),
    year: 2015,
    season: 'Summer',
    theme: 'Back & forth',
    date: 'August 15, 2015',
    venue: 'GUC Main Auditorium, New Cairo',
    recap: 'Our world operates in a dynamic design of opposite yet complementary forces. TEDxGUC "Back & Forth" explores how life exists in constant motion between opposing yet complementary states.',
    speakers: talkIdMap['backAndForth'].map(talk => ({
      name: talk.speaker,
      talkTitle: talk.title,
      topic: talk.topic
    })),
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop'
    ],
    sponsors: ['TED', 'GUC']
  }
];

// Find and remove the incorrect 2024-echo event, then add the corrected one
seed.events = seed.events.filter(e => e.id !== '2024-echo');
newEvents.push({
  id: '2024-echo-corrected',
  year: 2024,
  season: 'Spring',
  theme: 'ECHO',
  date: 'May 17, 2024',
  venue: 'GUC Main Auditorium, New Cairo',
  recap: 'Beyond the echoes of faint whispers and symphonies of words lies a million untold narratives. TEDxGUC ECHO explores the impact of words and opinions, posing the question: Will we separate the souls, artists and personalities from the opinions or will cancel culture thrive?',
  speakers: talkIdMap['echo'].map(talk => ({
    name: talk.speaker,
    talkTitle: talk.title,
    topic: talk.topic
  })),
  gallery: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop'
  ],
  sponsors: ['TED', 'GUC']
});

// Check if ALLOY event exists
const alloyEventExists = seed.events.some(e => e.theme === 'ALLOY' || e.theme === 'Alloy');
if (!alloyEventExists) {
  console.log('⚠️ ALLOY event not found in events array, creating it...');
  newEvents.push({
    id: '2017-alloy',
    year: 2017,
    season: 'Fall',
    theme: 'ALLOY',
    date: 'September 2017',
    venue: 'GUC Conference Center, New Cairo',
    recap: 'An alloy is a compound mixture or union of distinct parties that exchange characteristics to optimize a desired outcome. TEDxGUC ALLOY explored how diverse elements combine to create stronger solutions.',
    speakers: seed.talks.filter(t => [9,10,11,12,13,14,15,16,17].includes(parseInt(t.id))).map(talk => ({
      name: talk.speaker,
      talkTitle: talk.title,
      topic: talk.topic
    })),
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop'
    ],
    sponsors: ['TED', 'GUC']
  });
}

// Add new events to seed
seed.events.push(...newEvents);

// Save updated seed file
fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf-8');

console.log(`✅ Successfully added all missing events and talks!`);
console.log(`📝 New talks added: ${Object.values(talkIdMap).flat().length} talks (IDs ${maxId + 1}-${talkId - 1})`);
console.log(`📅 New events added: ${newEvents.length}`);
console.log(`💾 Updated seed-content.json with:`);
console.log(`   - Total talks: ${seed.talks.length}`);
console.log(`   - Total events: ${seed.events.length}`);
