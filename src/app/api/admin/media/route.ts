import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

function checkAuth(request: Request): boolean {
  const password = request.headers.get("x-admin-password") ?? "";
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ items: [] });
  }
  const { data } = await supabase.from("media").select("id, name, url, created_at").order("created_at", { ascending: false });
  return NextResponse.json({ items: data ?? [] });
}

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
  const name = (formData.get("name") as string) || file?.name || "image";
  if (!file || !file.size) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const ext = file.name.split(".").pop() || "jpg";
  const path = `media/${Date.now()}-${name.slice(0, 20)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage.from("site").upload(path, buf, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }
  const { data: urlData } = admin.storage.from("site").getPublicUrl(path);
  const url = urlData.publicUrl;
  const { data: row, error: insertError } = await admin.from("media").insert({ name: file.name, url }).select("id, name, url, created_at").single();
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }
  return NextResponse.json(row);
}
