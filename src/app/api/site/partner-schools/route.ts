import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { supabase } from "@/lib/supabase/client";

const PARTNER_COUNT = 6;

async function getLocalPartnerLogos(): Promise<string[]> {
  try {
    const metaPath = path.join(process.cwd(), "public", "uploads", ".partner-school-logos.json");
    const raw = await readFile(metaPath, "utf-8");
    const data = JSON.parse(raw) as { logos?: string[] };
    const logos = data.logos ?? [];
    return Array.from({ length: PARTNER_COUNT }, (_, i) => logos[i] ?? "");
  } catch {
    return Array(PARTNER_COUNT).fill("");
  }
}

/** 前台公开接口：获取合作院校 logo 列表（按顺序 6 个） */
export async function GET() {
  if (supabase) {
    const { data } = await supabase.from("site_settings").select("value").eq("key", "partner_school_logos").single();
    if (data?.value) {
      try {
        const logos = JSON.parse(data.value) as string[];
        const list = Array.from({ length: PARTNER_COUNT }, (_, i) => logos[i] ?? "");
        return NextResponse.json({ logos: list });
      } catch {
        // fallback to local or empty
      }
    }
  }
  const logos = await getLocalPartnerLogos();
  return NextResponse.json({ logos });
}
