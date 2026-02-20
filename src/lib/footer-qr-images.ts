import { supabaseAdmin } from "@/lib/supabase/server";

const QR_COUNT = 2;
const KEY = "footer_qr_urls";

/** 服务端获取页脚「扫码关注」两个二维码图片 URL */
export async function getFooterQrUrls(): Promise<string[]> {
  const client = supabaseAdmin;
  if (!client) return Array(QR_COUNT).fill("");
  const { data } = await client.from("site_settings").select("value").eq("key", KEY).maybeSingle();
  if (!data?.value) return Array(QR_COUNT).fill("");
  try {
    const arr = JSON.parse(data.value) as string[];
    return Array.from({ length: QR_COUNT }, (_, i) =>
      Array.isArray(arr) && typeof arr[i] === "string" ? arr[i] : ""
    );
  } catch {
    return Array(QR_COUNT).fill("");
  }
}
