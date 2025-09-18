// app/layout.tsx
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { ClientWrapper } from "@/components/ClientWrapper";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flair Select",
  description: "The fastest way to find creators.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  noStore();
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en" className="h-full bg-red-600"><body
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-red-600 overflow-x-hidden antialiased`}
    >
      <ClientWrapper session={session}>{children}</ClientWrapper>
    </body></html>
  );
}
