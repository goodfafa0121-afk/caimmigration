import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

function checkAuth(request: Request): boolean {
  const password = request.headers.get("x-admin-password") ?? "";
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

/** 未连接 Supabase 时：保存到 public/uploads，供前台直接访问 */
async function saveLogoToLocal(buf: Buffer, ext: string): Promise<string> {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const filename = `site-logo.${ext}`;
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buf);
  const metaPath = path.join(dir, ".site-logo.json");
  const logoUrl = `/uploads/${filename}`;
  await writeFile(metaPath, JSON.stringify({ logoUrl }));
  return logoUrl;
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || !file.size) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
  const ext = /^[a-z0-9]+$/.test(rawExt) ? rawExt : "png";
  const buf = Buffer.from(await file.arrayBuffer());

  const admin = supabaseAdmin;
  if (admin) {
    const storagePath = `logo.${ext}`;
    const { error: uploadError } = await admin.storage.from("site").upload(storagePath, buf, {
      contentType: file.type,
      upsert: true,
    });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }
    const { data: urlData } = admin.storage.from("site").getPublicUrl(storagePath);
    const logoUrl = urlData.publicUrl;
    await admin.from("site_settings").upsert({ key: "logo_url", value: logoUrl }, { onConflict: "key" });
    return NextResponse.json({ logoUrl });
  }

  try {
    const logoUrl = await saveLogoToLocal(buf, ext);
    return NextResponse.json({ logoUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Local save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
