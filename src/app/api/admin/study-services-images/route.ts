import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const SLOT_COUNT = 6;

function checkAuth(request: Request): boolean {
  const password = request.headers.get("x-admin-password") ?? "";
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

async function getImages(): Promise<string[]> {
  const client = supabaseAdmin ?? supabase;
  if (!client) return Array(SLOT_COUNT).fill("");
  const { data } = await client
    .from("site_settings")
    .select("value")
    .eq("key", "home_study_services_images")
    .maybeSingle();
  if (!data?.value) return Array(SLOT_COUNT).fill("");
  try {
    const arr = JSON.parse(data.value) as string[];
    return Array.from({ length: SLOT_COUNT }, (_, i) =>
      Array.isArray(arr) && typeof arr[i] === "string" ? arr[i] : ""
    );
  } catch {
    return Array(SLOT_COUNT).fill("");
  }
}

async function saveImages(images: string[]) {
  const admin = supabaseAdmin;
  if (!admin) throw new Error("Supabase not configured");
  const value = JSON.stringify(images.slice(0, SLOT_COUNT));
  await admin.from("site_settings").upsert({ key: "home_study_services_images", value }, { onConflict: "key" });
}

/** 后台：获取 6 张留学服务卡片图片 */
export async function GET(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const images = await getImages();
  return NextResponse.json({ images });
}

/** 后台：上传第 index 张（0～5）卡片的图片 */
export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = supabaseAdmin;
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const indexStr = (formData.get("index") as string) ?? "";
  const index = parseInt(indexStr, 10);
  if (!file?.size || !Number.isInteger(index) || index < 0 || index >= SLOT_COUNT) {
    return NextResponse.json({ error: "Invalid file or index (0-5)" }, { status: 400 });
  }
  const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
  const ext = /^[a-z0-9]+$/.test(rawExt) ? rawExt : "jpg";
  const buf = Buffer.from(await file.arrayBuffer());
  const path = `study-services/${index}.${ext}`;
  const { error: uploadError } = await admin.storage.from("site").upload(path, buf, { contentType: file.type, upsert: true });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
  const { data: urlData } = admin.storage.from("site").getPublicUrl(path);
  const images = await getImages();
  images[index] = urlData.publicUrl;
  await saveImages(images);
  return NextResponse.json({ images });
}
