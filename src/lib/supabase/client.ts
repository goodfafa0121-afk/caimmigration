import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

const isValidUrl = (s: string) => s.startsWith("https://") || s.startsWith("http://");

export const supabase: SupabaseClient | null =
  isValidUrl(supabaseUrl) && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type ConsultationInsert = {
  name: string;
  phone: string;
  email: string;
  message: string;
  locale?: string;
};
