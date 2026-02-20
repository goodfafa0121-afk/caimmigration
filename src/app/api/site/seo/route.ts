import { NextResponse } from "next/server";
import { getSeoSettings } from "@/lib/seo-settings";

/** 前台：获取网站 SEO 设置（供客户端或 SSG 使用） */
export async function GET() {
  const seo = await getSeoSettings();
  return NextResponse.json(seo);
}
