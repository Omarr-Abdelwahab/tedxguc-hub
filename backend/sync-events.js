import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seed-content.json');
const dbPath = path.join(__dirname, 'data/tedxguc.sqlite');

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
const db = new Database(dbPath);

// Extract events from seed
const events = seed.events;

// Update or insert events in database
const payload = JSON.stringify(events);

try {
  const stmt = db.prepare('UPDATE content_items SET payload = ? WHERE key = ?');
  const result = stmt.run(payload, 'events');
  
  if (result.changes === 0) {
    // If no rows updated, insert instead
    const insertStmt = db.prepare('INSERT INTO content_items (key, payload) VALUES (?, ?)');
    insertStmt.run('events', payload);
    console.log('✅ Inserted events into database');
  } else {
    console.log('✅ Updated events in database');
  }
  
  console.log(`📅 Total events synced: ${events.length}`);
  console.log('\nEvents in database:');
  events.forEach((e, i) => {
    console.log(`  ${i + 1}. ${e.theme} (${e.year})`);
  });
} catch (error) {
  console.error('❌ Error syncing events:', error.message);
  process.exit(1);
}

db.close();
