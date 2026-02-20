import { supabaseAdmin } from "@/lib/supabase/server";

const KEY = "seo_settings";

const DEFAULT_SEO = {
  title: "简单移民咨询 | 加拿大移民 Express Entry PNP 专业顾问",
  description:
    "简单移民咨询有限公司（Easy Immigration Consulting Inc.）提供加拿大移民专业服务：Express Entry、CEC、省提名PNP、学签转移民。持牌顾问，合规高效。",
  keywords: "加拿大移民, Express Entry, PNP, 省提名, CEC, 加拿大留学移民, 移民咨询",
  ogTitle: "简单移民咨询 | 加拿大移民专业顾问",
  ogDescription: "持牌加拿大移民顾问，Express Entry、PNP、学签转移民一站式服务。",
  ogImage: "" as string,
};

export type SeoSettings = typeof DEFAULT_SEO;

/** 服务端获取网站 SEO 设置，用于 layout metadata（Google 收录、分享预览） */
export async function getSeoSettings(): Promise<SeoSettings> {
  const client = supabaseAdmin;
  if (!client) return DEFAULT_SEO;
  const { data } = await client.from("site_settings").select("value").eq("key", KEY).maybeSingle();
  if (!data?.value || typeof data.value !== "string") return DEFAULT_SEO;
  try {
    const parsed = JSON.parse(data.value) as Partial<SeoSettings>;
    return {
      title: typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim() : DEFAULT_SEO.title,
      description: typeof parsed.description === "string" && parsed.description.trim() ? parsed.description.trim() : DEFAULT_SEO.description,
      keywords: typeof parsed.keywords === "string" ? parsed.keywords : DEFAULT_SEO.keywords,
      ogTitle: typeof parsed.ogTitle === "string" && parsed.ogTitle.trim() ? parsed.ogTitle.trim() : DEFAULT_SEO.ogTitle,
      ogDescription: typeof parsed.ogDescription === "string" && parsed.ogDescription.trim() ? parsed.ogDescription.trim() : DEFAULT_SEO.ogDescription,
      ogImage: typeof parsed.ogImage === "string" ? parsed.ogImage.trim() : DEFAULT_SEO.ogImage,
    };
  } catch {
    return DEFAULT_SEO;
  }
}
