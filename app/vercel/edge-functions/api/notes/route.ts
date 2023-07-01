import { getNotes } from "@/lib/data";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

// References: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
// Run this function on edge.
export const runtime = "edge";

export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    return NextResponse.error();
  }

  const notes = await getNotes({ supabase, userId: user.id });

  return NextResponse.json({ notes });
}
