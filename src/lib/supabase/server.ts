import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

const isValidUrl = (s: string) => s.startsWith("https://") || s.startsWith("http://");

/** 仅在后端使用，用于 admin 写入（Storage 上传、表增删改） */
export const supabaseAdmin =
  isValidUrl(supabaseUrl) && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;
