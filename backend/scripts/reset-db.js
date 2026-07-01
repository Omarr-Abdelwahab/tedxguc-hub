import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const sqliteBasePath = path.join(dataDir, "tedxguc.sqlite");
const sqliteArtifacts = [
  sqliteBasePath,
  `${sqliteBasePath}-wal`,
  `${sqliteBasePath}-shm`,
  `${sqliteBasePath}-journal`,
];

let deletedCount = 0;
let lockedPath = null;

for (const filePath of sqliteArtifacts) {
  if (!fs.existsSync(filePath)) {
    continue;
  }

  try {
    fs.unlinkSync(filePath);
    deletedCount += 1;
    console.log(`Deleted ${path.relative(process.cwd(), filePath)}`);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "EBUSY") {
      lockedPath = filePath;
      break;
    }

    throw error;
  }
}

if (deletedCount === 0) {
  if (lockedPath) {
    console.error(`Database is in use: ${path.relative(process.cwd(), lockedPath)}`);
    console.error("Stop the backend process and run db:reset again.");
    process.exitCode = 1;
  } else {
    console.log("No SQLite database files found.");
  }
}