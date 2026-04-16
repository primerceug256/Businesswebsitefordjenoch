"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/info";

export default function Protected({ children }: any) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
      } else {
        setUser(data.user);
      }
    });
  }, []);

  if (!user) return <p>Loading...</p>;

  return children;
}