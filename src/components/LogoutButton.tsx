"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut(); // don't pass scope: "global"
    router.push("/forms?mode=login");
  }

  return (
    <button onClick={handleLogout} className="rounded bg-[#111827] px-4 py-2 text-white">
      Logout
    </button>
  );
}
