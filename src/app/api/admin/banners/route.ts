import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

function checkAuth(request: Request): boolean {
  const password = request.headers.get("x-admin-password") ?? "";
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

async function getBanners(): Promise<{ image_url: string; title: string; subtitle: string; cta_text: string; cta_link?: string }[]> {
  const admin = supabaseAdmin ?? supabase;
  if (!admin) return [];
  const { data } = await admin.from("site_settings").select("value").eq("key", "home_banners").single();
  if (!data?.value) return [];
  try {
    const arr = JSON.parse(data.value);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function saveBanners(banners: { image_url: string; title: string; subtitle: string; cta_text: string; cta_link?: string }[]) {
  const admin = supabaseAdmin;
  if (!admin) throw new Error("Supabase not configured");
  await admin.from("site_settings").upsert(
    { key: "home_banners", value: JSON.stringify(banners) },
    { onConflict: "key" }
  );
}

/** 后台：获取首页 Banner 列表 */
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const banners = await getBanners();
  return NextResponse.json({ banners });
}

/** 后台：新增一条 Banner（上传背景图 + 文案） */
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = supabaseAdmin;
  if (!admin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string)?.trim() ?? "";
  const subtitle = (formData.get("subtitle") as string)?.trim() ?? "";
  const cta_text = (formData.get("cta_text") as string)?.trim() ?? "免费评估";
  const cta_link = (formData.get("cta_link") as string)?.trim() || undefined;

  if (!file || !file.size) {
    return NextResponse.json({ error: "请选择背景图" }, { status: 400 });
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
  const ext = /^[a-z0-9]+$/.test(rawExt) ? rawExt : "jpg";
  const buf = Buffer.from(await file.arrayBuffer());
  const storagePath = `banners/${Date.now()}.${ext}`;

  const { error: uploadError } = await admin.storage.from("site").upload(storagePath, buf, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }
  const { data: urlData } = admin.storage.from("site").getPublicUrl(storagePath);
  const image_url = urlData.publicUrl;

  const banners = await getBanners();
  banners.push({ image_url, title, subtitle, cta_text, cta_link });
  await saveBanners(banners);

  return NextResponse.json({ banners });
}

/** 后台：删除指定索引的 Banner */
export async function DELETE(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = supabaseAdmin;
  if (!admin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  const indexStr = searchParams.get("index");
  const index = indexStr != null ? parseInt(indexStr, 10) : NaN;
  const banners = await getBanners();
  if (!Number.isInteger(index) || index < 0 || index >= banners.length) {
    return NextResponse.json({ error: "Invalid index" }, { status: 400 });
  }
  banners.splice(index, 1);
  await saveBanners(banners);
  return NextResponse.json({ banners });
}
