import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

for (const file of ["healhub.sqlite", "healhub.sqlite-shm", "healhub.sqlite-wal"]) {
  const filePath = path.join(dataDir, file);

  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }
}

console.log("HealHub local database reset. Run npm run dev to recreate seed data.");
