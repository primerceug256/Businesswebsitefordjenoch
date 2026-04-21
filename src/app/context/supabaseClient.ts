import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from '@utils/supabase/info';

// This ensures we point to nlhpnvzpbceolsbozrjw.supabase.co

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);