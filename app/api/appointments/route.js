import { NextResponse } from "next/server";
import db from "@/app/_lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const limit = Number(searchParams.get("limit"));
  const datesOnly = searchParams.get("datesOnly") === "true";

  if (datesOnly) {
    const rows = db
      .prepare("SELECT date FROM appointments ORDER BY date ASC")
      .all();
    return NextResponse.json(rows);
  }

  if (date) {
    const rows = db
      .prepare("SELECT * FROM appointments WHERE date = ? ORDER BY created_at DESC")
      .all(date);
    return NextResponse.json(rows);
  }

  const rows = db
    .prepare("SELECT * FROM appointments ORDER BY created_at DESC")
    .all();

  return NextResponse.json(limit > 0 ? rows.slice(0, limit) : rows);
}

export async function POST(request) {
  const appointment = await request.json();
  const result = db
    .prepare(
      `INSERT INTO appointments
        (desc, department, urgency, med_spec, date, auth_user)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      appointment.desc || "",
      appointment.department,
      appointment.urgency,
      appointment.med_spec,
      appointment.date,
      appointment.auth_user || null
    );

  const created = db
    .prepare("SELECT * FROM appointments WHERE id = ?")
    .get(result.lastInsertRowid);

  return NextResponse.json(created, { status: 201 });
}
