import { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://easygoco.com");

/** 供 Google 等搜索引擎抓取的站点地图，有助于收录 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: BASE, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/immigration`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/study`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/visa`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/enterprise`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/scores`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/family`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
