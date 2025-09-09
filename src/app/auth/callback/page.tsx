"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/dashboard";
      const from = searchParams.get("from"); // keep existing behavior as fallback

      try {
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("exchangeCodeForSession error:", error);
            return router.replace("/forms?mode=login"); // safe fallback
          }
        }
      } catch (e) {
        console.error("exchangeCodeForSession threw:", e);
        return router.replace("/forms?mode=login"); // safe fallback
      }

      // Prefer `next`; keep `from` fallback to avoid breaking existing links
      if (from === "onboarding") {
        router.replace("/onboarding?from=google");
      } else {
        router.replace(next);
      }
    };
    run();
  }, [router, searchParams, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
      Redirecting...
    </div>
  );
}
