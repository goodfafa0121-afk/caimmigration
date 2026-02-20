import { readFile } from "fs/promises";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase/server";

const SETTINGS_KEY = "study_page_hero_image";

async function getLocalStudyHeroUrl(): Promise<string | null> {
  try {
    const metaPath = path.join(process.cwd(), "public", "uploads", ".study-hero.json");
    const raw = await readFile(metaPath, "utf-8");
    const data = JSON.parse(raw) as { imageUrl?: string };
    return data.imageUrl ?? null;
  } catch {
    return null;
  }
}

/** 服务端获取留学规划页头部背景图 URL（用于 study 页直出） */
export async function getStudyHeroImageUrl(): Promise<string | null> {
  const admin = supabaseAdmin;
  if (admin) {
    const { data } = await admin.from("site_settings").select("value").eq("key", SETTINGS_KEY).maybeSingle();
    if (data?.value && typeof data.value === "string") return data.value;
    return null;
  }
  return getLocalStudyHeroUrl();
}
