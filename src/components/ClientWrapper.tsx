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
        name: 'sb-auth-token',
        domain: 'flairselect.vercel.app', // ✅ your domain
        path: '/',
        sameSite: 'lax',
        secure: true, // ✅ MUST be true for HTTPS (production)
      },
    })
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={session}>
      {children}
    </SessionContextProvider>
  );
}
