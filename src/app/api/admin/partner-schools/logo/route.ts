import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import { supabaseAdmin } from "@/lib/supabase/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const PARTNER_COUNT = 6;

function checkAuth(request: Request): boolean {
  const password = request.headers.get("x-admin-password") ?? "";
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

async function getCurrentLogos(): Promise<string[]> {
  if (supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "partner_school_logos")
      .maybeSingle();
    if (data?.value) {
      try {
        const logos = JSON.parse(data.value) as string[];
        return Array.from({ length: PARTNER_COUNT }, (_, i) => logos[i] ?? "");
      } catch {
        // ignore
      }
    }
  }
  try {
    const metaPath = path.join(process.cwd(), "public", "uploads", ".partner-school-logos.json");
    const raw = await readFile(metaPath, "utf-8");
    const data = JSON.parse(raw) as { logos?: string[] };
    const logos = data.logos ?? [];
    return Array.from({ length: PARTNER_COUNT }, (_, i) => logos[i] ?? "");
  } catch {
    return Array(PARTNER_COUNT).fill("");
  }
}

async function saveLogosToLocal(logos: string[]): Promise<void> {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const metaPath = path.join(dir, ".partner-school-logos.json");
  await writeFile(metaPath, JSON.stringify({ logos }));
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const indexStr = formData.get("index") as string | null;
  const index = indexStr != null ? parseInt(indexStr, 10) : NaN;
  if (!file || !file.size || !Number.isInteger(index) || index < 0 || index >= PARTNER_COUNT) {
    return NextResponse.json({ error: "Invalid file or index" }, { status: 400 });
  }
  const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
  const ext = /^[a-z0-9]+$/.test(rawExt) ? rawExt : "png";
  const buf = Buffer.from(await file.arrayBuffer());

  const currentLogos = await getCurrentLogos();

  if (supabaseAdmin) {
    const storagePath = `partner-schools/${index}.${ext}`;
    const { error: uploadError } = await supabaseAdmin.storage.from("site").upload(storagePath, buf, {
      contentType: file.type,
      upsert: true,
    });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }
    const { data: urlData } = supabaseAdmin.storage.from("site").getPublicUrl(storagePath);
    const logoUrl = urlData.publicUrl;
    const nextLogos = [...currentLogos];
    nextLogos[index] = logoUrl;
    await supabaseAdmin
      .from("site_settings")
      .upsert({ key: "partner_school_logos", value: JSON.stringify(nextLogos) }, { onConflict: "key" });
    return NextResponse.json({ logos: nextLogos });
  }

  const dir = path.join(process.cwd(), "public", "uploads", "partner-schools");
  await mkdir(dir, { recursive: true });
  const filename = `${index}.${ext}`;
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buf);
  const logoUrl = `/uploads/partner-schools/${filename}`;
  const nextLogos = [...currentLogos];
  nextLogos[index] = logoUrl;
  await saveLogosToLocal(nextLogos);
  return NextResponse.json({ logos: nextLogos });
}
