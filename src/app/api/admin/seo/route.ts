import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getSeoSettings, type SeoSettings } from "@/lib/seo-settings";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const KEY = "seo_settings";

function checkAuth(request: Request): boolean {
  const password = request.headers.get("x-admin-password") ?? "";
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

/** 后台：获取 SEO 设置 */
export async function GET(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const seo = await getSeoSettings();
  return NextResponse.json(seo);
}

/** 后台：保存 SEO 设置 */
export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = supabaseAdmin;
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const body = (await request.json()) as Partial<SeoSettings>;
  const seo: SeoSettings = {
    title: typeof body.title === "string" ? body.title : "",
    description: typeof body.description === "string" ? body.description : "",
    keywords: typeof body.keywords === "string" ? body.keywords : "",
    ogTitle: typeof body.ogTitle === "string" ? body.ogTitle : "",
    ogDescription: typeof body.ogDescription === "string" ? body.ogDescription : "",
    ogImage: typeof body.ogImage === "string" ? body.ogImage : "",
  };
  const value = JSON.stringify(seo);
  const { error } = await admin.from("site_settings").upsert({ key: KEY, value }, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(seo);
}
