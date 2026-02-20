import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { supabase } from "@/lib/supabase/client";

const SETTINGS_KEY = "visa_page_hero_image";

async function getLocalVisaHeroUrl(): Promise<string | null> {
  try {
    const metaPath = path.join(process.cwd(), "public", "uploads", ".visa-hero.json");
    const raw = await readFile(metaPath, "utf-8");
    const data = JSON.parse(raw) as { imageUrl?: string };
    return data.imageUrl ?? null;
  } catch {
    return null;
  }
}

/** 前台：获取签证服务页头部背景图 URL */
export async function GET() {
  if (supabase) {
    const { data } = await supabase.from("site_settings").select("value").eq("key", SETTINGS_KEY).maybeSingle();
    if (data?.value && typeof data.value === "string") return NextResponse.json({ imageUrl: data.value });
  }
  const local = await getLocalVisaHeroUrl();
  return NextResponse.json({ imageUrl: local });
}
