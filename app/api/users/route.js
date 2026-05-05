import { NextResponse } from "next/server";
import db from "@/app/_lib/db";

export async function POST(request) {
  const { email, password, birthDate, name, surname, medicalID, profileImageUrl } =
    await request.json();

  const existingUser = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email);

  if (existingUser) {
    return NextResponse.json(
      { error: "Account with this email already exists" },
      { status: 409 }
    );
  }

  const id = crypto.randomUUID();

  const create = db.transaction(() => {
    db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(
      id,
      email,
      password
    );

    const patient = db
      .prepare(
        `INSERT INTO patients
          (auth_user_id, name, surname, birthDate, medicalID, profileImageUrl)
        VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        id,
        name,
        surname,
        birthDate,
        medicalID,
        profileImageUrl || "/logo.png"
      );

    return { user: { id, email }, patientId: patient.lastInsertRowid };
  });

  return NextResponse.json(create(), { status: 201 });
}
