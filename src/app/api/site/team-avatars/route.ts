import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";

const SLOT_COUNT = 3;

/** 前台：获取服务团队 3 位顾问的头像 URL */
export async function GET() {
  const client = supabaseAdmin ?? supabase;
  if (!client) {
    return NextResponse.json({ avatars: Array(SLOT_COUNT).fill("") });
  }
  const { data } = await client
    .from("site_settings")
    .select("value")
    .eq("key", "team_avatar_urls")
    .maybeSingle();
  if (!data?.value) {
    return NextResponse.json({ avatars: Array(SLOT_COUNT).fill("") });
  }
  try {
    const arr = JSON.parse(data.value) as string[];
    const avatars = Array.from({ length: SLOT_COUNT }, (_, i) =>
      Array.isArray(arr) && typeof arr[i] === "string" ? arr[i] : ""
    );
    return NextResponse.json({ avatars });
  } catch {
    return NextResponse.json({ avatars: Array(SLOT_COUNT).fill("") });
  }
}
