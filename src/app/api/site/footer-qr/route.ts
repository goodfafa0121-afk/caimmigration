import { NextResponse } from "next/server";
import { getFooterQrUrls } from "@/lib/footer-qr-images";

/** 前台：获取页脚扫码关注两个二维码 URL */
export async function GET() {
  const qrUrls = await getFooterQrUrls();
  return NextResponse.json({ qrUrls });
}
