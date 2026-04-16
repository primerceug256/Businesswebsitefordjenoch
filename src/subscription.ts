import { supabase } from "@/utils/supabase/info";

export const checkSubscription = async () => {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) return false;

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!data) return false;

  return new Date(data.expires_at) > new Date();
};