import { supabaseAdmin } from "@/lib/supabase/server";

const KEY = "consult_qr_image";

/** 服务端获取「24小时 在线咨询」弹窗二维码图片 URL */
export async function getConsultQrImageUrl(): Promise<string | null> {
  const client = supabaseAdmin;
  if (!client) return null;
  const { data } = await client.from("site_settings").select("value").eq("key", KEY).maybeSingle();
  if (!data?.value || typeof data.value !== "string") return null;
  return data.value.trim() || null;
}
