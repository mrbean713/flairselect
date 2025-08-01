"use client";

import { useEffect, useState } from "react";
import { FaRocket, FaCheckCircle, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // TODO: Replace with actual user fetch from Supabase or context
    setUser({ name: "Nick Sobhanian", email: "nick@theflaircollective.com" });
  }, []);

  const handleLogout = () => {
    // TODO: Implement Supabase signOut and redirect
    router.push("/forms?mode=login");
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-12 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Flair Select Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">{user?.email || "Loading..."}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-5 rounded-lg transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </header>

        {/* Welcome Banner */}
        <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || "Loading..."} 👋</h2>
          <p className="text-gray-600 text-lg">Ready to discover your next influencer campaign? Let's get started.</p>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaRocket className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Campaigns */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Recent Campaigns</h3>
            <button className="text-red-600 hover:text-red-700 font-medium">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">F</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Fashion Campaign</h4>
              <p className="text-sm text-gray-600 mb-4">Gender: Female • Views: 50k+ • Engagement: 3%+</p>
              <div className="text-xs text-gray-500">⏳ 16h 24m remaining</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">F</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Fitness Campaign</h4>
              <p className="text-sm text-gray-600 mb-4">Location: LA • Followers: 100k+ • Age: 25-35</p>
              <div className="text-xs text-gray-500">⏳ 1d 3h remaining</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">T</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Tech Review Campaign</h4>
              <p className="text-sm text-gray-600 mb-4">Niche: Tech • Platform: YouTube • Duration: 2-5min</p>
              <div className="text-xs text-green-600 font-medium">✅ 12 influencers matched</div>
            </div>
          </div>
        </section>

        {/* New Campaign CTA */}
        <section className="bg-red-600 p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Ready for Your Next Campaign?</h3>
          <p className="text-red-100 mb-6">Get matched with perfect influencers for your brand in 24 hours or less.</p>
          <button
            onClick={() => router.push("/request")}
            className="inline-flex items-center gap-2 bg-white text-red-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <FaRocket /> Request New Campaign
          </button>
        </section>
      </div>
    </main>
  );
}