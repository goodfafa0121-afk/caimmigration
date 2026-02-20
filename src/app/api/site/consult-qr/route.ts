import { NextResponse } from "next/server";
import { getConsultQrImageUrl } from "@/lib/consult-qr-image";

/** 前台：获取在线咨询弹窗二维码 URL */
export async function GET() {
  const imageUrl = await getConsultQrImageUrl();
  return NextResponse.json({ imageUrl: imageUrl ?? "" });
}
