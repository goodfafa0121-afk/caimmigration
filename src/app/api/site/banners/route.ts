import { NextResponse } from "next/server";
import { getHomeBanners } from "@/lib/banners";

export { type HomeBanner } from "@/lib/banners";

/** 前台公开：获取首页 Banner 列表，无数据时返回空数组 */
export async function GET() {
  const banners = await getHomeBanners();
  return NextResponse.json({ banners }, {
    headers: { "Cache-Control": "no-store" },
  });
}
