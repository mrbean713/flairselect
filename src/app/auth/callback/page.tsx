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
      const from = searchParams.get("from");

      // 🔑 Exchange the OAuth code for a session (critical!)
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      // Then route wherever you want
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
