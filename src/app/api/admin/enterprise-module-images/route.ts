import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getEnterpriseModuleImages } from "@/lib/enterprise-module-images";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const KEY_CONDITIONS = "enterprise_conditions_image";
const KEY_TAX_SERVICE = "enterprise_tax_service_image";
const SLOTS = ["conditions", "tax"] as const;
type Slot = (typeof SLOTS)[number];

function checkAuth(request: Request): boolean {
  const password = request.headers.get("x-admin-password") ?? "";
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

function keyForSlot(slot: Slot): string {
  return slot === "conditions" ? KEY_CONDITIONS : KEY_TAX_SERVICE;
}

/** 后台：获取企业服务页两模块图片 URL */
export async function GET(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const urls = await getEnterpriseModuleImages();
  return NextResponse.json(urls);
}

/** 后台：上传指定模块图片，body: formData { file, slot: "conditions" | "tax" } */
export async function POST(request: Request) {
  if (!checkAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = supabaseAdmin;
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const slot = (formData.get("slot") as string) ?? "";
  if (!file?.size || !SLOTS.includes(slot as Slot)) {
    return NextResponse.json({ error: "Invalid file or slot (conditions|tax)" }, { status: 400 });
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
  const ext = /^[a-z0-9]+$/.test(rawExt) ? rawExt : "jpg";
  const buf = Buffer.from(await file.arrayBuffer());
  const storagePath = `enterprise/${slot}.${ext}`;
  const { error: uploadError } = await admin.storage.from("site").upload(storagePath, buf, {
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = admin.storage.from("site").getPublicUrl(storagePath);
  const key = keyForSlot(slot as Slot);
  await admin.from("site_settings").upsert({ key, value: urlData.publicUrl }, { onConflict: "key" });
  const urls = await getEnterpriseModuleImages();
  return NextResponse.json(urls);
}
