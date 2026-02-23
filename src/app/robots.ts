import { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://easygoco.com");

/** 告诉搜索引擎可以抓取哪些页面，以及 sitemap 位置，有助于 Google 收录 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
