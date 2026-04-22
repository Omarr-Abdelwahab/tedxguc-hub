import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seed-content.json');

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

// Parse date and sort events chronologically
const dateMap = {
  '2015': { 'August 15': 1, 'August': 1 },
  '2017': { 'September': 1 },
  '2021': { 'September 18': 1, 'September': 1 },
  '2023': { 'September 27': 1, 'September': 1 },
  '2024': { 'May 17': 1, 'May': 1, 'September 28': 2, 'September': 2 },
  '2025': { 'May 17': 1, 'May': 1, 'September 27': 2, 'September': 2 }
};

seed.events.sort((a, b) => {
  // Extract year
  const yearA = parseInt(a.date.match(/\d{4}/)[0]);
  const yearB = parseInt(b.date.match(/\d{4}/)[0]);
  
  if (yearA !== yearB) {
    return yearA - yearB;
  }
  
  // If same year, sort by month
  const monthMap = { 'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12 };
  
  const getMonth = (dateStr) => {
    for (const [month, num] of Object.entries(monthMap)) {
      if (dateStr.includes(month)) return num;
    }
    return 0;
  };
  
  const monthA = getMonth(a.date);
  const monthB = getMonth(b.date);
  
  return monthA - monthB;
});

console.log('✅ Events sorted by date (chronological order):\n');
seed.events.forEach((e, i) => {
  console.log(`${i + 1}. ${e.theme} (${e.date})`);
});

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf-8');
console.log(`\n✅ Updated seed-content.json`);
