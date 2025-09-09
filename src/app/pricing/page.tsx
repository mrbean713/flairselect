// app/pricing/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCheck } from "react-icons/fi";

export default function PricingPage() {
  const router = useRouter();

  const featuresListOnly = [
    "Curated creator list",
    "Instagram, TikTok, LinkedIn",
    "Vetted creators only",
    "Delivered in 24–48 hours",
  ];

  const featuresListPlusDM = [
    "Everything in List tier",
    "We handle DM outreach",
    "Personalized first messages",
    "Response tracking & sheet",
    "Status updates via email",
    "Final List of Committed Creators"
  ];

  const featuresIntegration = [
    "Everything in List tier",
    "Personalized first messages",
    "Full IG integration (outreach from your brand account)",
    "Includes 5 lists per month",
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Pricing
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* $250 – List Only */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10 flex flex-col">
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
                onClick={() => router.push("/request")}
                className="w-full bg-red-600 text-white font-bold py-4 text-lg rounded-lg hover:bg-red-700 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>

          {/* $1,000 – List + DM Outreach (Most Popular) */}
          <div className="relative bg-white rounded-2xl shadow-xl border-2 border-red-600 p-8 md:p-10 flex flex-col">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              Most Popular
            </span>

            <div className="mb-6">
              <p className="text-gray-900 font-semibold text-lg">List + DM Outreach</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold text-gray-900">$1,000</span>
                <span className="text-gray-600 text-lg">/ list + outreach</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 text-gray-800">
              {featuresListPlusDM.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <FiCheck className="mt-1 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <p className="text-sm text-gray-600 mb-4">
                We craft and send DMs to the curated list and facilitate campaign onboarding.
              </p>

              <button
                onClick={() => router.push("/request")}
                className="w-full bg-red-600 text-white font-bold py-4 text-lg rounded-lg hover:bg-red-700 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>

          {/* $2,500 install + $1,000/mo – Full Integration */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10 flex flex-col">
            <div className="mb-6">
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

            <ul className="space-y-3 mb-8 text-gray-800">
              {featuresIntegration.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <FiCheck className="mt-1 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <p className="text-sm text-gray-600 mb-4">
                We plug our brand into your brand’s IG backend with automated mass DM outreach and follow-ups.{" "}
                <span className="font-semibold"></span>
              </p>

              <Link
                href="https://calendly.com/" // ← replace with your real booking link
                target="_blank"
                className="block w-full bg-red-600 text-white font-bold py-4 text-lg rounded-lg hover:bg-red-700 transition-colors text-center"
              >
                Book Integration Call
              </Link>
            </div>
          </div>
        </div>

        {/* Optional fine print */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need something different?{" "}
          <Link href="/contact" className="text-gray-700 underline hover:no-underline">
            Get in touch
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
