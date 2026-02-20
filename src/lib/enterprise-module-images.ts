import { supabaseAdmin } from "@/lib/supabase/server";

const KEY_CONDITIONS = "enterprise_conditions_image";
const KEY_TAX_SERVICE = "enterprise_tax_service_image";

/** 服务端获取企业服务页两个模块的图片 URL（申请条件、企业报税服务） */
export async function getEnterpriseModuleImages(): Promise<{
  conditionsImageUrl: string | null;
  taxServiceImageUrl: string | null;
}> {
  const client = supabaseAdmin;
  if (!client) return { conditionsImageUrl: null, taxServiceImageUrl: null };

  const { data: rows } = await client
    .from("site_settings")
    .select("key, value")
    .in("key", [KEY_CONDITIONS, KEY_TAX_SERVICE]);

  let conditionsImageUrl: string | null = null;
  let taxServiceImageUrl: string | null = null;
  for (const row of rows ?? []) {
    if (row.key === KEY_CONDITIONS && typeof row.value === "string") conditionsImageUrl = row.value;
    if (row.key === KEY_TAX_SERVICE && typeof row.value === "string") taxServiceImageUrl = row.value;
  }
  return { conditionsImageUrl, taxServiceImageUrl };
}
