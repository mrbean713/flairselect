"use client";

import {
  FaTimesCircle,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import LogoutButton from "@/components/LogoutButton";
import { FiClock } from "react-icons/fi";



export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const session = useSession();
  const supabase = createClientComponentClient();
  const router = useRouter();

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
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-red-600">FLAIR</div>
      {session?.user ? (
        <div className="flex items-center gap-4">
          <Link href="/pricing">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer">
              Pricing
            </button>
          </Link>
          <span className="text-gray-600 font-medium">
            Welcome, {companyName || "Company"}
          </span>
          <LogoutButton />
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <Link href="/pricing">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer">
              Pricing
            </button>
          </Link>
          <Link href="/forms?mode=login">
  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer">
    Login
  </button>
</Link>

          <Link href="/forms?mode=signup">
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  </header>


      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Hero Content */}
            <div className="w-full lg:w-1/2">
              <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <h2 className="text-lg text-gray-600 mb-3 font-medium">
                  Welcome to
                </h2>
                <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black mb-8 leading-none tracking-tight">
  <span className="text-red-600">FLAIR</span><br />
                  <span className="text-gray-900">Select</span>
                </h1>
                <p className="text-xl text-gray-700 max-w-xl leading-relaxed mb-12">
                  The most precise influencer sourcing engine in the world. <br />
                  We deliver creators for <span className="font-semibold text-gray-900">any niche, any criteria</span> — no matter how specific.
                  <br /><br />
                  Built with proprietary tools. Trusted by the best. Better than agencies.
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
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
                <div className="flex flex-col sm:flex-row gap-8">
                  {/* Old Way */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-200">
                      Old way
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Can't find enough niche creators",
                        "Filters don't work",
                        "Outdated influencer data",
                        "Complicated platforms",
                      ].map((text, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-200 group hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <FaTimesCircle className="text-red-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Flair Way */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-red-600 mb-6 pb-2 border-b-2 border-red-200">
                      FLAIR way
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Submit your criteria",
                        "Receive influencers within 48 hours",
                        "Get put in contact with desired creators",
                        "Launch your campaign",
                      ].map((text, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-200 group hover:bg-green-100 transition-colors cursor-pointer">
                          <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <p className="text-gray-800 font-medium text-sm leading-relaxed">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex justify-center mt-8 pt-6 border-t border-gray-100">
                  <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer">
                    Submit Campaign
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
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
            {[
              {
                title: "Any Level of Specificity",
                description: "No matter how specific your criteria, we'll find creators that match — guaranteed.",
                number: "01"
              },
              {
                title: "Quality and Quantity",
                description: "Whether you need creators who match specific niches, location, follower count, or any other criteria — Flair delivers both quality and scale.",
                number: "02"
              },
              {
                title: "Dynamic",
                description: "Flair Select doesn't rely on vague filters or outdated tags. Our proprietary tech uses real-time data from social platforms to identify influencers that actually fit your campaign.",
                number: "03"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100">
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
              This isn't just another generic influencer sourcing platform — it's the future of creator sourcing. Welcome to precision. Welcome to the best.
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
            Join thousands of brands who trust FLAIR Select for their influencer campaigns.
          </p>
          <button className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl cursor-pointer">
            Start Your Campaign Today
          </button>
        </div>
      </section>
    </main>
  );
}
