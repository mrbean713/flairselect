"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useMemo, useState } from "react";
import type { Session } from "@supabase/auth-helpers-nextjs";

export function ClientWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const isBrowser = typeof window !== "undefined";
  const hostname = isBrowser ? window.location.hostname : "";
  const isProd = isBrowser && (hostname.endsWith(".vercel.app") || hostname === "flairselect.vercel.app");

  // ✅ Use helpers client; don't rename cookies; only add domain/secure in prod
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      ...(isProd
        ? {
            cookieOptions: {
              // keep the default name (sb-<project-ref>-auth-token)
              path: "/",
              sameSite: "lax",
              secure: true,
              // domain must match the exact apex you serve on
              domain: "flairselect.vercel.app",
            },
          }
        : {
            // In dev, let helpers manage cookies (no domain/secure),
            // so PKCE works on http://localhost:3000
          }),
    })
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={session}>
      {children}
    </SessionContextProvider>
  );
}
