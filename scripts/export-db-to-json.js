#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const backendDir = path.join(projectRoot, "backend");
const dbPath = path.join(backendDir, "data", "tedxguc.sqlite");
const outputPath = path.join(backendDir, "seed-content.json");

// Expected keys in the JSON export
const EXPECTED_KEYS = [
  "talks",
  "orgTreesBySeason",
  "events",
  "sponsors",
  "upcomingEvent",
  "upcomingSchedule",
  "upcomingFAQs",
  "upcomingSpeakers",
  "contactSubjects",
];

/**
 * Export data from SQLite database to JSON
 */
const exportDatabaseToJson = async () => {
  try {
    // Check if database file exists
    if (!fs.existsSync(dbPath)) {
      console.error(`❌ Database file not found at: ${dbPath}`);
      process.exit(1);
    }

    console.log(`📂 Reading database from: ${dbPath}`);

    // Import better-sqlite3 dynamically
    let Database;
    try {
      ({ default: Database } = await import("better-sqlite3"));
    } catch (error) {
      console.error("❌ better-sqlite3 is not installed. Install it with: npm install better-sqlite3");
      process.exit(1);
    }

    // Open database connection
    const db = new Database(dbPath, { readonly: true });

    // Query all content items
    const query = db.prepare("SELECT key, payload FROM content_items ORDER BY key ASC");
    const rows = query.all();

    if (rows.length === 0) {
      console.warn("⚠️  No data found in content_items table");
    }

    // Build JSON object
    const exportedData = {};
    let foundKeys = new Set();

    for (const row of rows) {
      try {
        exportedData[row.key] = JSON.parse(row.payload);
        foundKeys.add(row.key);
        console.log(`  ✓ Exported: ${row.key} (${Array.isArray(exportedData[row.key]) ? exportedData[row.key].length + " items" : "1 object"})`);
      } catch (parseError) {
        console.warn(`  ⚠️  Failed to parse JSON for key "${row.key}": ${parseError.message}`);
      }
    }

    // Verify all expected keys are present
    const missingKeys = EXPECTED_KEYS.filter((key) => !foundKeys.has(key));
    if (missingKeys.length > 0) {
      console.warn(`⚠️  Missing expected keys: ${missingKeys.join(", ")}`);
    }

    // Ensure all expected keys exist in output (even if empty)
    for (const key of EXPECTED_KEYS) {
      if (!exportedData[key]) {
        exportedData[key] = Array.isArray(exportedData[EXPECTED_KEYS[0]]) ? [] : {};
        console.log(`  ⚠️  Added empty placeholder for: ${key}`);
      }
    }

    // Write to file with pretty formatting
    const jsonString = JSON.stringify(exportedData, null, 2);
    fs.writeFileSync(outputPath, jsonString, "utf-8");

    console.log(`\n✅ Successfully exported database to: ${outputPath}`);
    console.log(`📊 Exported ${foundKeys.size} data sections`);

    // Close database
    db.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Export failed:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
};

// Run the export
exportDatabaseToJson();
