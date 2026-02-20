import { supabaseAdmin } from "@/lib/supabase/server";

const KEY = "immigration_project_images";
const SLOT_COUNT = 12;

/** 服务端获取移民页项目卡片图片 URL 列表（按顺序 12 张），用于首屏或 SSR */
export async function getImmigrationProjectImages(): Promise<string[]> {
  const client = supabaseAdmin;
  if (!client) return Array(SLOT_COUNT).fill("");
  const { data } = await client.from("site_settings").select("value").eq("key", KEY).maybeSingle();
  if (!data?.value || typeof data.value !== "string") return Array(SLOT_COUNT).fill("");
  try {
    const arr = JSON.parse(data.value) as string[];
    return Array.from({ length: SLOT_COUNT }, (_, i) => (Array.isArray(arr) && typeof arr[i] === "string" ? arr[i] : ""));
  } catch {
    return Array(SLOT_COUNT).fill("");
  }
}
