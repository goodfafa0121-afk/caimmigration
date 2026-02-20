import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";

const SLOT_COUNT = 8;

/** 前台：获取首页「推荐移民项目」8 张卡片对应的图片 URL，仅图片、文案用静态 */
export async function GET() {
  const client = supabaseAdmin ?? supabase;
  if (!client) {
    return NextResponse.json({ images: Array(SLOT_COUNT).fill("") });
  }
  const { data } = await client
    .from("site_settings")
    .select("value")
    .eq("key", "home_services_images")
    .maybeSingle();
  if (!data?.value) {
    return NextResponse.json({ images: Array(SLOT_COUNT).fill("") });
  }
  try {
    const arr = JSON.parse(data.value) as string[];
    const images = Array.from({ length: SLOT_COUNT }, (_, i) => (Array.isArray(arr) && typeof arr[i] === "string" ? arr[i] : ""));
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: Array(SLOT_COUNT).fill("") });
  }
}
