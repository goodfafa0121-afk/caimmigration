import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getConsultQrImageUrl } from "@/lib/consult-qr-image";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const KEY = "consult_qr_image";

function checkAuth(request: Request): boolean {
  const password = request.headers.get("x-admin-password") ?? "";
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

/** 后台：获取在线咨询二维码 URL */
export async function GET(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const imageUrl = await getConsultQrImageUrl();
  return NextResponse.json({ imageUrl: imageUrl ?? "" });
}

/** 后台：上传在线咨询二维码图 */
export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = supabaseAdmin;
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file?.size) return NextResponse.json({ error: "No file" }, { status: 400 });

  const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
  const ext = /^[a-z0-9]+$/.test(rawExt) ? rawExt : "png";
  const buf = Buffer.from(await file.arrayBuffer());
  const storagePath = `consult-qr/qr.${ext}`;
  const { error: uploadError } = await admin.storage.from("site").upload(storagePath, buf, {
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = admin.storage.from("site").getPublicUrl(storagePath);
  await admin.from("site_settings").upsert({ key: KEY, value: urlData.publicUrl }, { onConflict: "key" });
  const imageUrl = await getConsultQrImageUrl();
  return NextResponse.json({ imageUrl: imageUrl ?? "" });
}
