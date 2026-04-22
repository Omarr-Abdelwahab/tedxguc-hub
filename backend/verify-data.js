import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seed-content.json');
const dbPath = path.join(__dirname, 'data/tedxguc.sqlite');

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
const db = new Database(dbPath);

// Get content from database
const row = db.prepare('SELECT payload FROM content_items WHERE key = ?').get('events');
const dbEvents = JSON.parse(row.payload);
const talksRow = db.prepare('SELECT payload FROM content_items WHERE key = ?').get('talks');
const dbTalks = JSON.parse(talksRow.payload);

console.log('📊 DATABASE VERIFICATION REPORT\n');
console.log('='.repeat(60));

// Check for duplicate ECHO events
const echoEvents = dbEvents.filter(e => e.theme === 'ECHO');
if (echoEvents.length > 1) {
  console.log(`⚠️ Found ${echoEvents.length} ECHO events (should be 1):`);
  echoEvents.forEach((e, i) => {
    console.log(`   ${i + 1}. ID: ${e.id}, Date: ${e.date}, Speakers: ${e.speakers.length}`);
  });
  console.log('\n🔧 Removing duplicate ECHO events...');
  
  // Keep only the first ECHO event
  const uniqueEvents = dbEvents.filter((e, idx) => {
    if (e.theme === 'ECHO' && dbEvents.findIndex(x => x.theme === 'ECHO') !== idx) {
      return false;
    }
    return true;
  });
  
  const cleanedPayload = JSON.stringify(uniqueEvents);
  db.prepare('UPDATE content_items SET payload = ? WHERE key = ?').run(cleanedPayload, 'events');
  console.log(`✅ Cleaned up duplicates. Events now: ${uniqueEvents.length}`);
} else {
  console.log(`✅ No duplicate ECHO events found`);
}

console.log('\n='.repeat(60));
console.log('📅 ALL EVENTS IN DATABASE:\n');

const finalEvents = db.prepare('SELECT payload FROM content_items WHERE key = ?').get('events');
const finalEventsList = JSON.parse(finalEvents.payload);

finalEventsList.forEach((event, idx) => {
  console.log(`${idx + 1}. ${event.theme}`);
  console.log(`   Year: ${event.year} | Date: ${event.date}`);
  console.log(`   Speakers: ${event.speakers.length} | Sponsors: ${event.sponsors.join(', ')}`);
  console.log();
});

console.log('='.repeat(60));
console.log(`📝 TALKS VERIFICATION:\n`);
console.log(`Total talks in database: ${dbTalks.length}`);
console.log(`Total talks in seed file: ${seed.talks.length}`);
console.log(`Match: ${dbTalks.length === seed.talks.length ? '✅ YES' : '❌ NO'}`);

console.log('\n📊 TALKS BY YEAR:\n');
const talksByYear = {};
dbTalks.forEach(talk => {
  if (!talksByYear[talk.year]) talksByYear[talk.year] = 0;
  talksByYear[talk.year]++;
});

Object.entries(talksByYear).sort((a, b) => b[0] - a[0]).forEach(([year, count]) => {
  console.log(`  ${year}: ${count} talks`);
});

console.log('\n✅ VERIFICATION COMPLETE');

db.close();
