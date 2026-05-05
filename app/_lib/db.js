import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath =
  process.env.HEALHUB_DB_PATH ||
  path.join(process.cwd(), "data", "healhub.sqlite");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auth_user_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    birthDate TEXT,
    medicalID TEXT,
    profileImageUrl TEXT,
    FOREIGN KEY (auth_user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    desc TEXT,
    department TEXT NOT NULL,
    urgency TEXT NOT NULL,
    med_spec TEXT NOT NULL,
    date TEXT NOT NULL,
    auth_user INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (auth_user) REFERENCES patients(id) ON DELETE SET NULL
  );
`);

const demoUser = db
  .prepare("SELECT id FROM users WHERE email = ?")
  .get("demo@healhub.local");

if (!demoUser) {
  const insertUser = db.prepare(
    "INSERT INTO users (id, email, password) VALUES (?, ?, ?)"
  );
  const insertPatient = db.prepare(`
    INSERT INTO patients
      (auth_user_id, name, surname, birthDate, medicalID, profileImageUrl)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertAppointment = db.prepare(`
    INSERT INTO appointments
      (desc, department, urgency, med_spec, date, auth_user, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const seed = db.transaction(() => {
    insertUser.run("demo-user", "demo@healhub.local", "password123");
    const patient = insertPatient.run(
      "demo-user",
      "Demo",
      "Patient",
      "1990-01-15",
      "100200300",
      "/logo.png"
    );

    insertAppointment.run(
      "Annual heart health review",
      "Cardiology (Heart Health)",
      "Routine Check-Up",
      "Dr. Amelia Sanders",
      "2026-05-20",
      patient.lastInsertRowid,
      "2026-05-01 09:00:00"
    );
    insertAppointment.run(
      "Skin irritation follow-up",
      "Dermatology (Skin Care)",
      "Minor Issue",
      "Dr. Charlotte Hughes",
      "2026-06-03",
      patient.lastInsertRowid,
      "2026-05-02 10:30:00"
    );
  });

  seed();
}

export default db;
