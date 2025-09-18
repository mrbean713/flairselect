// app/pricing/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCheck, FiClock } from "react-icons/fi";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiTiktok } from "react-icons/si";
import { useSession } from "@supabase/auth-helpers-react";

export default function PricingPage() {
  const router = useRouter();

  const IconRow = ({ children }: { children: React.ReactNode }) => (
    <div
      className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow"
      aria-hidden
    >
      {children}
    </div>
  );
  const session = useSession();

  const goToRequest = (tier: string) => {
    const next = `/request?tier=${encodeURIComponent(tier)}`;
    if (!session?.user) {
      // Redirect to login if not logged in
      router.push(`/forms?mode=login&next=${encodeURIComponent(next)}`);
    } else {
      router.push(next);
    }
  };

  const iconCls = "w-5 h-5";

  const featuresListOnly = [
    "Curated creator list",
    "Instagram, TikTok, X, LinkedIn, Youtube",
    "Vetted creators only",
    "Delivered in 24–48 hours",
  ];

  const featuresListPlusDM = [
    "Everything in List tier",
    "We handle DM outreach",
    "Personalized first messages",
    "Response tracking & sheet",
    "Status updates via email",
    "Final List of Committed Creators",
  ];

  const featuresIntegration = [
    "Everything in List tier",
    "Personalized first messages",
    "Full IG integration (outreach from your brand account)",
    "Includes 5 lists per month",
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24 relative">
      {/* Sticky Back to Home Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors shadow cursor-pointer"
      >
        ← Back to Home
      </button>

      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Pricing
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* $250 – List Only */}
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10 flex flex-col">
            <IconRow>
              <FaInstagram className={`${iconCls} text-pink-500`} title="Instagram" />
              <SiTiktok className={iconCls} style={{ color: "#010101" }} title="TikTok" />
              <FaXTwitter className={iconCls} style={{ color: "#000000" }} title="X (Twitter)" />
              <FaLinkedin className={`${iconCls} text-blue-600`} title="LinkedIn" />
              <FaYoutube className={`${iconCls} text-red-600`} title="YouTube" />
            </IconRow>

            <div className="mb-6">
              <p className="text-gray-900 font-semibold text-lg">Influencer List</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold text-gray-900">$250</span>
                <span className="text-gray-600 text-lg">/ list</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 text-gray-800">
              {featuresListOnly.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <FiCheck className="mt-1 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <p className="text-sm text-gray-600 mb-4">
                Submit campaign info, attach your brief, and receive your list of creators.
              </p>

              <button
                onClick={() => goToRequest("list_only")}
                className="w-full bg-red-600 text-white font-bold py-4 text-lg rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
              >
                Submit Request
              </button>
            </div>
          </div>

          {/* $1,000 – List + DM Outreach (Most Popular) */}
          <div className="relative bg-white rounded-2xl shadow-xl border-2 border-red-600 p-8 md:p-10 flex flex-col">
            {/* IG logo at top */}
            <IconRow>
              <FaInstagram className={`${iconCls} text-pink-500`} title="Instagram" />
            </IconRow>

            {/* Most Popular badge BELOW the logo */}
            <span className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              Most Popular
            </span>

            <div className="mb-6 mt-8">
              <p className="text-gray-900 font-semibold text-lg">List + DM Outreach</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold text-gray-900">$1,000</span>
                <span className="text-gray-600 text-lg">/ list + outreach</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6 text-gray-800">
              {featuresListPlusDM.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <FiCheck className="mt-1 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* Coming soon note */}
            <div className="w-full flex justify-center my-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700">
                <FiClock className="text-orange-500" />
                <span className="text-sm font-medium">Coming soon for other platforms</span>
              </div>
            </div>

            <div className="mt-auto">
              <p className="text-sm text-gray-600 mb-4">
                We craft and send DMs to the curated list and facilitate campaign onboarding.
              </p>

              <button
                onClick={() => goToRequest("list_plus_dm")}
                className="w-full bg-red-600 text-white font-bold py-4 text-lg rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
              >
                Submit Request
              </button>
            </div>
          </div>

          {/* $2,500 install + $1,000/mo – Full Integration */}
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10 flex flex-col">
            {/* IG logo on top */}
            <IconRow>
              <FaInstagram className={`${iconCls} text-pink-500`} title="Instagram" />
            </IconRow>

            <div className="mb-6 mt-6">
              <p className="text-gray-900 font-semibold text-lg">Integrated Outreach</p>
              <div className="mt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold text-gray-900">$2,500</span>
                  <span className="text-gray-600 text-lg">installation</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">$1,000</span>
                  <span className="text-gray-600 text-base">/ month maintenance</span>
                </div>
              </div>
            </div>

            <ul className="space-y-3 mb-6 text-gray-800">
              {featuresIntegration.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <FiCheck className="mt-1 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* Coming soon note */}
            <div className="w-full flex justify-center my-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700">
                <FiClock className="text-orange-500" />
                <span className="text-sm font-medium">Coming soon for other platforms</span>
              </div>
            </div>

            <div className="mt-auto">
              <p className="text-sm text-gray-600 mb-4">
                We plug our brand into your brand’s IG backend with automated mass DM outreach and follow-ups.
              </p>

              <Link
                href="#"
                onClick={(e) => { e.preventDefault(); goToRequest("integration_setup"); }}
                className="block w-full bg-red-600 text-white font-bold py-4 text-lg rounded-lg hover:bg-red-700 transition-colors text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div> {/* <-- missing closing div for the grid (added) */}

        {/* Optional fine print */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need something different?{" "}
          <a
            href="mailto:sam@theflaircollective.com?cc=nick@theflaircollective.com"
            className="text-gray-700 underline hover:no-underline"
          >
            Get in touch
          </a>
          .
        </p>
      </div>
    </main>
  );
}
