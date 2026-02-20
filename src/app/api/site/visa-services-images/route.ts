import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";

const SLOT_COUNT = 6;

/** 前台：获取推荐签证服务图片 URL（首页 4 张 + 签证页 6 张，含超级签证、毕业工签） */
export async function GET() {
  const client = supabaseAdmin ?? supabase;
  if (!client) {
    return NextResponse.json({ images: Array(SLOT_COUNT).fill("") });
  }
  const { data } = await client
    .from("site_settings")
    .select("value")
    .eq("key", "home_visa_services_images")
    .maybeSingle();
  if (!data?.value) {
    return NextResponse.json({ images: Array(SLOT_COUNT).fill("") });
  }
  try {
    const arr = JSON.parse(data.value) as string[];
    const images = Array.from({ length: SLOT_COUNT }, (_, i) =>
      Array.isArray(arr) && typeof arr[i] === "string" ? arr[i] : ""
    );
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: Array(SLOT_COUNT).fill("") });
  }
}
