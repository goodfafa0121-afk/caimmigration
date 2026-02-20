import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

/** 前台公开接口：获取移民项目列表（后台配置的优先于静态文案） */
export async function GET() {
  if (!supabase) {
    return NextResponse.json({ items: [] });
  }
  const { data } = await supabase.from("immigration_projects").select("*").order("sort_order", { ascending: true });
  const items = (data ?? []).map((p) => ({
    type: p.type,
    hot: p.hot ?? false,
    slug: (p as { slug?: string }).slug ?? undefined,
    title: p.title,
    desc: p.desc,
    period: p.period,
    investment: p.investment,
    identity: p.identity,
    language: p.language,
    budget: p.budget,
    image_url: p.image_url ?? undefined,
  }));
  return NextResponse.json({ items });
}
