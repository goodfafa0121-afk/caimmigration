import { supabaseAdmin } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";

export type HomeBanner = {
  image_url: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link?: string;
};

/** 服务端/API 获取首页 Banner 列表，用于首屏直出、避免蓝屏闪烁 */
export async function getHomeBanners(): Promise<HomeBanner[]> {
  const client = supabaseAdmin ?? supabase;
  if (!client) return [];
  const { data } = await client
    .from("site_settings")
    .select("value")
    .eq("key", "home_banners")
    .maybeSingle();
  if (!data?.value) return [];
  try {
    const banners = JSON.parse(data.value) as HomeBanner[];
    return Array.isArray(banners) ? banners : [];
  } catch {
    return [];
  }
}
