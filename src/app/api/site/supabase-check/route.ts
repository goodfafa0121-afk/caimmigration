import { NextResponse } from "next/server";
import { getHomeBanners } from "@/lib/banners";
import { getLogoUrl } from "@/lib/logo-url";
import { getConsultQrImageUrl } from "@/lib/consult-qr-image";

/**
 * 诊断接口：检查 Vercel 上 Supabase 是否配置正确、能否读到图/数据。
 * 访问 /api/site/supabase-check 即可，不暴露敏感信息。
 */
export async function GET() {
  const envUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const hasServiceKey = !!((process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim());
  const hasAnonKey = !!((process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim());
  const envUrlSet = envUrl.startsWith("https://") || envUrl.startsWith("http://");

  let bannersCount = 0;
  let logoOk = false;
  let consultQrOk = false;
  let queryError: string | null = null;

  if (envUrlSet && (hasServiceKey || hasAnonKey)) {
    try {
      const [banners, logoUrl, qrUrl] = await Promise.all([
        getHomeBanners(),
        getLogoUrl(),
        getConsultQrImageUrl(),
      ]);
      bannersCount = Array.isArray(banners) ? banners.length : 0;
      logoOk = !!(logoUrl && logoUrl.trim());
      consultQrOk = !!(qrUrl && qrUrl.trim());
    } catch (e) {
      queryError = e instanceof Error ? e.message : String(e);
    }
  }

  const ok = envUrlSet && (hasServiceKey || hasAnonKey) && !queryError && (bannersCount > 0 || logoOk || consultQrOk);

  return NextResponse.json(
    {
      ok,
      env: {
        urlSet: envUrlSet,
        hasServiceKey,
        hasAnonKey,
      },
      data: {
        bannersCount,
        logoOk,
        consultQrOk,
      },
      ...(queryError ? { error: queryError } : {}),
      hint: !envUrlSet
        ? "在 Vercel 项目 Settings → Environment Variables 中添加 NEXT_PUBLIC_SUPABASE_URL（以及 ANON_KEY 或 SERVICE_ROLE_KEY），保存后 Redeploy。"
        : !hasServiceKey && !hasAnonKey
          ? "在 Vercel 中添加 NEXT_PUBLIC_SUPABASE_ANON_KEY 或 SUPABASE_SERVICE_ROLE_KEY，保存后 Redeploy。"
          : queryError
            ? "连接 Supabase 时报错，请检查 URL 与 Key 是否正确、Supabase 项目是否可用。"
            : !ok
              ? "Supabase 已连接，但 home_banners / logo_url / consult_qr_image 在库里暂无数据。请在本地 /admin 后台上传 Banner、Logo、咨询二维码后再查看。"
              : "Supabase 配置正常，已能读到 Banner/Logo/咨询二维码。若前端仍不显示，请检查图片 URL 是否为完整 https 地址、Storage 桶是否设为 Public。",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
