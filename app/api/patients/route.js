import { NextResponse } from "next/server";
import db from "@/app/_lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const authUserId = searchParams.get("authUserId");

  if (!authUserId) {
    return NextResponse.json(
      { error: "authUserId is required" },
      { status: 400 }
    );
  }

  const patients = db
    .prepare("SELECT * FROM patients WHERE auth_user_id = ?")
    .all(authUserId);

  return NextResponse.json(patients);
}

export async function PUT(request) {
  const { authUserId, name, surname, birthDate, medicalID, profileImageUrl } =
    await request.json();

  if (!authUserId) {
    return NextResponse.json(
      { error: "authUserId is required" },
      { status: 400 }
    );
  }

  const result = db
    .prepare(
      `UPDATE patients
       SET name = ?, surname = ?, birthDate = ?, medicalID = ?, profileImageUrl = ?
       WHERE auth_user_id = ?`
    )
    .run(name, surname, birthDate, medicalID, profileImageUrl, authUserId);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  const updatedPatient = db
    .prepare("SELECT * FROM patients WHERE auth_user_id = ?")
    .get(authUserId);

  return NextResponse.json({
    message: "Patient details successfully updated!",
    updatedPatient,
  });
}
