import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../utils/supabase/info";

// This ensures we point to nlhpnvzpbceolsbozrjw.supabase.co

const supabaseUrl = "https://nlhpnvzpbceolsbozrjw.supabase.co";
const supabaseAnonKey = "sb_publishable_4k8plBPAQLHH8gF7k8_Zcg__t6-qvz3";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);