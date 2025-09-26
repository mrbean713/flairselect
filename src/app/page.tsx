"use client";

import {
  FaTimesCircle,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import LogoutButton from "@/components/LogoutButton";
import Image from "next/image";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const session = useSession();
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);

  const OLD_ITEMS = [
    "Can't find enough niche creators",
    "Filters don't work",
    "Outdated influencer data",
    "Complicated platforms",
  ];

  const NEW_ITEMS = [
    "Submit your criteria",
    "Receive influencers within 48 hours",
    "Get put in contact with desired creators",
    "Launch your campaign",
  ];

  const FEATURES = [
    {
      title: "Any Level of Specificity",
      description:
        "No matter how specific your criteria, we'll find creators that match — guaranteed.",
      number: "01",
    },
    {
      title: "Quality and Quantity",
      description:
        "Whether you need creators who match specific niches, location, follower count, or any other criteria — Flair delivers both quality and scale.",
      number: "02",
    },
    {
      title: "Dynamic",
      description:
        "Flair Select doesn't rely on vague filters or outdated tags. Our proprietary tech uses real-time data from social platforms to identify influencers that actually fit your campaign.",
      number: "03",
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);

    const fetchCompanyName = async () => {
      if (!session?.user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("company_name")
        .eq("id", session.user.id)
        .single();

      if (!error && data?.company_name) {
        setCompanyName(data.company_name);
      }
    };

    fetchCompanyName();
  }, [session, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Reloads the UI
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 relative overflow-x-hidden overflow-y-clip">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center justify-between">
            {/* Brand */}
            <Image
              src="/flair-logo.png"
              alt="Flair Logo"
              width={120}
              height={40}
              className="object-contain"
              priority
            />

            {/* Actions */}
            {session?.user ? (
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
                <Link href="/pricing" className="whitespace-nowrap">
                  <button
                    className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base
                               rounded-lg bg-red-600 text-white font-medium
                               hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Pricing
                  </button>
                </Link>

                <span className="hidden xs:block text-[13px] sm:text-sm md:text-base text-gray-600 font-medium whitespace-nowrap">
                  Welcome, {companyName || "Company"}
                </span>

                <div className="whitespace-nowrap">
                  <LogoutButton />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
                <Link href="/pricing" className="whitespace-nowrap">
                  <button
                    className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base
                               rounded-lg bg-red-600 text-white font-medium
                               hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    
                    Pricing
                  </button>
                </Link>

                <Link href="/forms?mode=login" className="whitespace-nowrap">
                  <button
                    className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base
                               rounded-lg bg-gray-100 text-gray-700
                               hover:bg-gray-200 hover:text-gray-900
                               transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                </Link>

                <Link href="/forms?mode=signup" className="whitespace-nowrap">
                  <button
                    className="px-3 py-1.5 md:px-5 md:py-2 text-sm md:text-base
                               rounded-xl bg-red-600 text-white font-semibold
                               hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Hero Content */}
            <div className="w-full lg:w-1/2">
              <div
                className={`transform transition-all duration-1000 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <img
                  src="/flair-logo-cropped.png"
                  alt="Flair Logo"
                  className="block h-28 sm:h-36 lg:h-44 object-contain mb-10"
                />

                <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black leading-none tracking-tight text-gray-900">
                  Select
                </h1>

                <p className="text-xl text-gray-700 max-w-xl leading-relaxed mb-12">
                  The most precise influencer sourcing engine in the world.{" "}
                  <br />
                  We deliver creators for{" "}
                  <span className="font-semibold text-gray-900">
                    any niche, any criteria
                  </span>{" "}
                  — no matter how specific.
                  <br />
                  <br />
                  Trusted by the best. Better than agencies.
                </p>

                {/* Dynamic Buttons */}
                {session?.user ? (
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-gray-900 text-white py-4 text-lg font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <div className="space-y-4 w-full max-w-sm">
                    <Link href="/forms?mode=login">
                      <button className="w-full bg-gray-900 text-white py-4 text-lg font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer">
                        Login
                      </button>
                    </Link>
                    <Link href="/forms?mode=signup">
                      <button className="w-full bg-white text-gray-900 border-2 border-gray-200 py-4 text-lg font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Section */}
{/* Comparison Section */}
{/* Comparison Section */}
<div className="w-full lg:w-5/6 xl:w-11/12">
  <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 items-start">
      <h3 className="text-xl font-bold text-gray-900 leading-none pb-2 mb-2 border-b border-red-200 h-10 flex items-center">
        Old way
      </h3>
      <h3 className="text-xl font-bold pb-2 mb-2 border-b border-red-200 h-10 flex items-center gap-2">
        <img
          src="/flair-logo-cropped.png"
          alt="Flair Logo"
          className="h-6 object-contain"
        />
        <span className="text-red-600 translate-y-[6px]">way</span>
      </h3>
                  {OLD_ITEMS.map((left, i) => (
                    <div className="contents" key={i}>
                      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-200 hover:bg-red-100 transition-colors min-h-[56px]">
                        <FaTimesCircle className="text-red-500 text-lg shrink-0" />
                        <p className="text-gray-700 text-base leading-none whitespace-nowrap">
                          {left}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-200 hover:bg-green-100 transition-colors min-h-[56px]">
                        <FaCheckCircle className="text-green-500 text-lg shrink-0" />
                        <p className="text-gray-800 text-base leading-none whitespace-nowrap">
                          {NEW_ITEMS[i]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Why Our Platform Is Different
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="group relative bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-6xl font-black text-red-100 mb-4 group-hover:text-red-200 transition-colors">
                  {feature.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 leading-relaxed">
              This isn't just another generic influencer sourcing platform — it's
              the future of creator sourcing. Welcome to precision. Welcome to the
              best.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-red-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-6">
            Ready to Find Your Perfect Creators?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Join thousands of brands who trust FLAIR Select for their influencer
            campaigns.
          </p>
          <button
            onClick={() =>
              session?.user
                ? router.push("/dashboard")
                : router.push("/forms?mode=signup")
            }
            className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl cursor-pointer"
          >
            Start Your Campaign Today
          </button>
        </div>
      </section>
    </main>
  );
}
