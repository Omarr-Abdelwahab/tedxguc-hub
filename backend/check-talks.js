import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data/tedxguc.sqlite');

const db = new Database(dbPath);

const row = db.prepare('SELECT payload FROM content_items WHERE key = ?').get('talks');
const talks = JSON.parse(row.payload);

console.log('✅ Verified talks in database:\n');
console.log('Talks 26-48 (newly added):');
talks.filter(t => parseInt(t.id) >= 26 && parseInt(t.id) <= 48).forEach(talk => {
  console.log(`  ${talk.id}. ${talk.speaker} - "${talk.title}"`);
  console.log(`     videoUrl: ${talk.videoUrl ? '✓ Present' : '✗ Empty'}`);
  console.log(`     thumbnail: ${talk.thumbnail ? '✓ Present' : '✗ Empty'}\n`);
});

db.close();
