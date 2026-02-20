import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

function checkAuth(request: Request): boolean {
  const password = request.headers.get("x-admin-password") ?? "";
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

/** 上传移民项目卡片图片：写入 Supabase Storage 并更新 immigration_projects.image_url */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = supabaseAdmin;
  if (!admin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const { id } = await params;
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || !file.size) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
  const ext = /^[a-z0-9]+$/.test(rawExt) ? rawExt : "png";
  const buf = Buffer.from(await file.arrayBuffer());

  const storagePath = `projects/${id}.${ext}`;
  const { error: uploadError } = await admin.storage.from("site").upload(storagePath, buf, {
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }
  const { data: urlData } = admin.storage.from("site").getPublicUrl(storagePath);
  const imageUrl = urlData.publicUrl;
  const { error: updateError } = await admin
    .from("immigration_projects")
    .update({ image_url: imageUrl })
    .eq("id", id);
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }
  return NextResponse.json({ image_url: imageUrl });
}
