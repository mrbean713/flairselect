// src/lib/supabaseServerClient.ts
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const createSupabaseServerClient = () => {
  return createServerComponentClient({ cookies });
};
