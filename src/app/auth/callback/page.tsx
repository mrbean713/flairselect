"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const exchangedRef = useRef(false); // ✅ prevents StrictMode/double-run issues

  useEffect(() => {
    const run = async () => {
      if (exchangedRef.current) return;
      exchangedRef.current = true;

      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/dashboard";
      const from = searchParams.get("from");

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("exchangeCodeForSession error:", error);
            return router.replace("/forms?mode=login");
          }
        }
      } catch (e) {
        console.error("exchangeCodeForSession threw:", e);
        return router.replace("/forms?mode=login");
      }

      router.replace(from === "onboarding" ? "/onboarding?from=google" : next);
    };
    run();
  }, [router, searchParams, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
      Redirecting...
    </div>
  );
}
