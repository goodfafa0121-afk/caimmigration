import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

function checkAuth(request: Request): boolean {
  const password = request.headers.get("x-admin-password") ?? "";
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = supabaseAdmin;
  if (!admin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const { id } = await params;
  const { error } = await admin.from("immigration_projects").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
