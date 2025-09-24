"use client";

import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function CompletedRequestsPage() {
  const session = useSession();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.user) return;

    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Failed to fetch completed requests:", error.message);
      } else {
        setRequests(data || []);
      }
    };

    fetchRequests();
  }, [session, supabase]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Completed Requests</h1>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className="py-3 px-4 font-semibold">#</th>
              <th className="py-3 px-4 font-semibold">Campaign Name</th>
              <th className="py-3 px-4 font-semibold">Niche</th>
              <th className="py-3 px-4 font-semibold">Platform</th>
              <th className="py-3 px-4 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={req.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{req.campaign_name || "-"}</td>
                <td className="py-3 px-4">{req.niche}</td>
                <td className="py-3 px-4">{req.platform}</td>
                <td className="py-3 px-4">
                  {new Date(req.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-900 font-medium">
                  No completed requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
