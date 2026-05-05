import { NextResponse } from "next/server";
import db from "@/app/_lib/db";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const appointment = db
    .prepare("SELECT * FROM appointments WHERE id = ?")
    .get(params.id);

  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  return NextResponse.json(appointment);
}

export async function PUT(request, { params }) {
  const appointment = await request.json();
  const result = db
    .prepare(
      `UPDATE appointments
       SET desc = ?, department = ?, urgency = ?, med_spec = ?, date = ?
       WHERE id = ?`
    )
    .run(
      appointment.desc || "",
      appointment.department,
      appointment.urgency,
      appointment.med_spec,
      appointment.date,
      params.id
    );

  if (result.changes === 0) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  const updated = db
    .prepare("SELECT * FROM appointments WHERE id = ?")
    .get(params.id);
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  const result = db.prepare("DELETE FROM appointments WHERE id = ?").run(params.id);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Appointment deleted successfully." });
}
