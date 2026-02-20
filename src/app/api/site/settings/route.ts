import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { supabase } from "@/lib/supabase/client";

/** 未连接 Supabase 时：从 public/uploads/.site-logo.json 读取本地 logo 路径 */
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

/** 前台公开接口：获取网站设置（如 logo） */
export async function GET() {
  if (supabase) {
    const { data } = await supabase.from("site_settings").select("value").eq("key", "logo_url").single();
    if (data?.value) return NextResponse.json({ logoUrl: data.value });
  }
  const localLogo = await getLocalLogoUrl();
  return NextResponse.json({ logoUrl: localLogo });
}
