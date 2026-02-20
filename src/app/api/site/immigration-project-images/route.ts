import { NextResponse } from "next/server";
import { getImmigrationProjectImages } from "@/lib/immigration-project-images";

/** 前台：获取移民页项目卡片图片 URL 列表（按顺序 12 张） */
export async function GET() {
  const images = await getImmigrationProjectImages();
  return NextResponse.json({ images });
}
