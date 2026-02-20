import { readFile } from "fs/promises";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase/server";

const KEY = "logo_url";

async function getLocalLogoUrl(): Promise<string | null> {
  try {
    const metaPath = path.join(process.cwd(), "public", "uploads", ".site-logo.json");
    const raw = await readFile(metaPath, "utf-8");
    const data = JSON.parse(raw) as { logoUrl?: string };
    return data.logoUrl ?? null;
  } catch {
    return null;
  }
}

/** 服务端获取网站 Logo URL，用于首屏直出、刷新后立即显示 */
export async function getLogoUrl(): Promise<string | null> {
  if (supabaseAdmin) {
    const { data } = await supabaseAdmin.from("site_settings").select("value").eq("key", KEY).maybeSingle();
    if (data?.value && typeof data.value === "string" && data.value.trim()) return data.value.trim();
  }
  return getLocalLogoUrl();
}
