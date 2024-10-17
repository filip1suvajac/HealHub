import { NextResponse } from "next/server";
import supabase from "./app/_lib/supabase";
export async function middleware(req) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the session exists, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/myAppointments/:path*", "/myProfile/:path*", "/home/:path*"],
};
