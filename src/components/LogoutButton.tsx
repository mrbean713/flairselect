"use client";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LogoutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  async function handleLogout() {
    // Clear server HttpOnly cookie (source of truth)
    await fetch("/auth/signout", { method: "POST", credentials: "include" });

    // Clear client-side state
    await supabase.auth.signOut().catch(() => {});

    // Ensure UI re-renders as logged out
    router.refresh();
    router.replace("/forms?mode=login");
  }

  return (
    <button onClick={handleLogout} className="rounded bg-[#111827] px-4 py-2 text-white cursor-pointer">
      Logout
    </button>
  );
}
