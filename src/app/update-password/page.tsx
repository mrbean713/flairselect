"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Password updated successfully!");
      setTimeout(() => router.push("/forms?mode=login"), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24 relative">
      {/* Back to Home */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors shadow"
      >
        ← Back to Home
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-14 w-full max-w-xl relative">
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded text-center font-medium text-sm border ${
              message.startsWith("✅")
                ? "text-green-800 bg-green-100 border-green-300"
                : "text-red-800 bg-red-100 border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <h1 className="text-2xl font-bold text-black text-center mb-6">
          Update Password
        </h1>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-4 text-lg rounded-lg hover:bg-red-700 transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </main>
  );
}
