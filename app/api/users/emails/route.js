import { NextResponse } from "next/server";
import db from "@/app/_lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const emails = db.prepare("SELECT email FROM users ORDER BY email").all();
  return NextResponse.json(emails.map((row) => row.email));
}
