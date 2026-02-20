import { NextResponse } from "next/server";
import { getEnterpriseModuleImages } from "@/lib/enterprise-module-images";

/** 前台：获取企业服务页两个模块的图片 URL */
export async function GET() {
  const { conditionsImageUrl, taxServiceImageUrl } = await getEnterpriseModuleImages();
  return NextResponse.json({ conditionsImageUrl, taxServiceImageUrl });
}
