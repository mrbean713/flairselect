"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";


export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅
  const session = useSession();
  const supabase = useSupabaseClient();
  const [companyType, setCompanyType] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    console.log("👤 Session:", session);
  
    if (!session) {
      console.log("❌ No session found yet");
      return;
    }
  
    const fromGoogle = searchParams.get("from") === "google";
  
    if (!fromGoogle) {
      console.log("🚫 User not from Google signup — redirecting to dashboard");
      router.push("/dashboard");
    } else {
      console.log("✅ Google signup detected — stay on onboarding");
    }
  }, [session, router, searchParams]);
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id || !session.user.email) {
      console.error("User not authenticated.");
      return;
    }

    const { error } = await supabase
    .from("profiles")
    .update({
      company_type: companyType,
      company_name: companyName,
    })
    .eq("id", session.user.id);
  

    if (error) {
      console.error("❌ Error updating profile:", error.message);
    } else {
      console.log("✅ Profile updated!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md sm:max-w-xl bg-white rounded-xl shadow-xl px-10 py-12 space-y-6 text-black">
        <h1 className="text-2xl font-semibold text-center">Tell us about your company</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Who Are You?</label>
            <select
              required
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
            >
              <option value="" disabled>Select company type</option>
              <option value="agency">Agency</option>
              <option value="brand">Brand</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Flair Marketing Co."
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
