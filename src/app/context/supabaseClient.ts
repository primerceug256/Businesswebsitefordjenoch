import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nlhpnvzpbceolsbozrjw.supabase.co";
const supabaseAnonKey = "sb_publishable_4k8plBPAQLHH8gF7k8_Zcg__t6-qvz3";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);