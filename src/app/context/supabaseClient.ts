import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_https://nlhpnvzpbceolsbozrjw.supabase.co;
const supabaseAnonKey = import.meta.env.VITE_sb_publishable_4k8plBPAQLHH8gF7k8_Zcg__t6-qvz3;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);