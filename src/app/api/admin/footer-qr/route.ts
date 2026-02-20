import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getFooterQrUrls } from "@/lib/footer-qr-images";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const KEY = "footer_qr_urls";
const SLOT_COUNT = 2;

function checkAuth(request: Request): boolean {
  const password = request.headers.get("x-admin-password") ?? "";
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

/** 后台：获取页脚两个二维码 URL */
export async function GET(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const qrUrls = await getFooterQrUrls();
  return NextResponse.json({ qrUrls });
}

/** 后台：上传第 index 张（0 或 1）二维码图 */
export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = supabaseAdmin;
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const indexStr = (formData.get("index") as string) ?? "";
  const index = parseInt(indexStr, 10);
  if (!file?.size || !Number.isInteger(index) || index < 0 || index >= SLOT_COUNT) {
    return NextResponse.json({ error: "Invalid file or index (0 or 1)" }, { status: 400 });
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
  const ext = /^[a-z0-9]+$/.test(rawExt) ? rawExt : "png";
  const buf = Buffer.from(await file.arrayBuffer());
  const storagePath = `footer-qr/${index}.${ext}`;
  const { error: uploadError } = await admin.storage.from("site").upload(storagePath, buf, {
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = admin.storage.from("site").getPublicUrl(storagePath);
  const urls = await getFooterQrUrls();
  urls[index] = urlData.publicUrl;
  await admin.from("site_settings").upsert({ key: KEY, value: JSON.stringify(urls) }, { onConflict: "key" });
  const updated = await getFooterQrUrls();
  return NextResponse.json({ qrUrls: updated });
}
