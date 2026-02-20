import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ logoUrl: null });
  }
  const { data } = await supabase.from("site_settings").select("value").eq("key", "logo_url").single();
  return NextResponse.json({ logoUrl: data?.value ?? null });
}
