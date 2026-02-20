import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const SETTINGS_KEY = "visa_page_hero_image";

function checkAuth(request: Request): boolean {
  const password = request.headers.get("x-admin-password") ?? "";
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

async function getCurrentUrl(): Promise<string | null> {
  const admin = supabaseAdmin;
  if (admin) {
    const { data } = await admin.from("site_settings").select("value").eq("key", SETTINGS_KEY).maybeSingle();
    if (data?.value && typeof data.value === "string") return data.value;
    return null;
  }
  try {
    const metaPath = path.join(process.cwd(), "public", "uploads", ".visa-hero.json");
    const raw = await readFile(metaPath, "utf-8");
    const parsed = JSON.parse(raw) as { imageUrl?: string };
    return parsed.imageUrl ?? null;
  } catch {
    return null;
  }
}

async function saveToLocal(buf: Buffer, ext: string): Promise<string> {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const filename = `visa-hero.${ext}`;
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buf);
  const imageUrl = `/uploads/${filename}`;
  const metaPath = path.join(dir, ".visa-hero.json");
  await writeFile(metaPath, JSON.stringify({ imageUrl }));
  return imageUrl;
}

/** 后台：获取签证服务页头部背景图 URL */
export async function GET(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const imageUrl = await getCurrentUrl();
  return NextResponse.json({ imageUrl });
}

/** 后台：上传签证服务页头部背景图 */
export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || !file.size) return NextResponse.json({ error: "No file" }, { status: 400 });
  const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
  const ext = /^[a-z0-9]+$/.test(rawExt) ? rawExt : "jpg";
  const buf = Buffer.from(await file.arrayBuffer());

  const admin = supabaseAdmin;
  if (admin) {
    const storagePath = `visa-hero.${ext}`;
    const { error: uploadError } = await admin.storage.from("site").upload(storagePath, buf, {
      contentType: file.type,
      upsert: true,
    });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
    const { data: urlData } = admin.storage.from("site").getPublicUrl(storagePath);
    const imageUrl = urlData.publicUrl;
    await admin.from("site_settings").upsert({ key: SETTINGS_KEY, value: imageUrl }, { onConflict: "key" });
    return NextResponse.json({ imageUrl });
  }

  try {
    const imageUrl = await saveToLocal(buf, ext);
    return NextResponse.json({ imageUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Local save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
