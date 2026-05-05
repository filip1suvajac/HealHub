import { NextResponse } from "next/server";
import db from "@/app/_lib/db";

export async function POST(request) {
  const { email, password } = await request.json();

  const user = db
    .prepare("SELECT id, email FROM users WHERE email = ? AND password = ?")
    .get(email, password);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  return NextResponse.json({ user });
}
