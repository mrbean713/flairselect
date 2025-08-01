"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();

  useEffect(() => {
    const from = searchParams.get("from");

    if (!session) {
      console.log("Waiting for session...");
      return;
    }

    if (from === "onboarding") {
      router.push("/onboarding?from=google");
    } else {
      router.push("/dashboard");
    }
  }, [session, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
      Redirecting...
    </div>
  );
}
