"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import type { Session } from "@supabase/auth-helpers-nextjs";

export function ClientWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {

    const [supabaseClient] = useState(() =>
        createPagesBrowserClient({
          cookieOptions: {
            name: "sb-flairselect-auth-token", // anything unique to your projec
            domain: ".flairselect.vercel.app", // ✅ NOTE THE DOT
            path: "/",
            sameSite: "Lax",
            secure: true,
          },
        })
      );
  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={session}>
      {children}
    </SessionContextProvider>
  );
}
