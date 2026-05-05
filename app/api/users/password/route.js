import { NextResponse } from "next/server";
import db from "@/app/_lib/db";

export async function PUT(request) {
  const { email, password } = await request.json();
  const result = db
    .prepare("UPDATE users SET password = ? WHERE email = ?")
    .run(password, email);

  if (result.changes === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Password updated successfully." });
}
