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
  const { data } = await supabase.from("immigration_projects").select("id, type, hot, title, desc, period, investment, identity, language, budget, sort_order, image_url").order("sort_order", { ascending: true });
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
  const body = await request.json();
  const {
    type = "tech",
    hot = false,
    title = "",
    desc = "",
    period = "",
    investment = "",
    identity = "",
    language = "",
    budget = "",
    sort_order = 0,
    image_url = null,
  } = body;
  const { data, error } = await admin
    .from("immigration_projects")
    .insert({ type, hot, title, desc, period, investment, identity, language, budget, sort_order, image_url })
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
