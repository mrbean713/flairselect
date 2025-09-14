"use client";

import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { FaRocket, FaCheckCircle, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DashboardPage() {
  const router = useRouter();
  const session = useSession();
  const supabase = createClientComponentClient();

  const [companyName, setCompanyName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [activeCampaigns, setActiveCampaigns] = useState<number>(0);
  const [totalRequests, setTotalRequests] = useState<number>(0);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("company_name, email")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("❌ Failed to fetch profile:", error.message);
      } else {
        setCompanyName(data.company_name || "Your Company");
        setEmail(data.email);
      }
    };

    const fetchCampaignStats = async () => {
      if (!session?.user) return;

      // Total requests
        // Completed requests for this user
        const { count: totalCount, error: totalError } = await supabase
        .from("requests")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id)
        .eq("status", "completed");


      if (!totalError) setTotalRequests(totalCount || 0);

      // Active campaigns (within 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: activeCount, error: activeError } = await supabase
        .from("requests")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .gte("created_at", twentyFourHoursAgo);

      if (!activeError) setActiveCampaigns(activeCount || 0);
    };

    fetchProfile();
    fetchCampaignStats();
  }, [session, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/forms?mode=login");
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-12 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Flair Select Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">{email || "Loading..."}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-5 rounded-lg transition-colors cursor-pointer"
          >
            <FaSignOutAlt /> Logout
          </button>
        </header>

        {/* Welcome Banner */}
        <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {companyName || "Loading..."} 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Ready to discover your next influencer campaign? Let's get started.
          </p>
        </section>

        
        {/* Stats Overview (Clickable) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
            onClick={() => router.push("/active")}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-left transform transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-red-400 cursor-pointer"
        >
            <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            </div>
        </button>

        <button
            onClick={() => router.push("/completed")}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-left transform transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-red-400 cursor-pointer"
        >
            <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">Completed Requests</p>
                <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaRocket className="text-blue-600 text-xl" />
            </div>
            </div>
        </button>
        </section>


        {/* New Campaign CTA */}
{/* New Campaign CTA */}
        <section className="bg-red-600 p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Ready for Your Next Campaign?</h3>
          <p className="text-red-100 mb-6">
            Get matched with perfect influencers for your brand in 24 hours or less.
          </p>
          <button
            onClick={() => router.push("/pricing")}   // <-- was "/request"
            className="inline-flex items-center gap-2 bg-white text-red-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
          >
            <FaRocket /> Request New Campaign
          </button>
        </section>

      </div>
    </main>
  );
}
