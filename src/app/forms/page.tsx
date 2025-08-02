"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

export default function Forms() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") || "login";
  const isLogin = mode === "login";

  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "agency",
    company: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleMode = (newMode: "login" | "signup") => {
    router.push(`/forms?mode=${newMode}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setConfirmationMessage("❌ Login failed: " + error.message);
        return;
      }

      router.push("/dashboard");
    } else {
      // ✅ SIGNUP FLOW with metadata
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            company_name: formData.company,
            company_type: formData.role,
          },
        },
      });

      if (error) {
        setConfirmationMessage("❌ Signup failed: " + error.message);
        return;
      }

      const { user, session } = data;

      if (!session && user) {
        setConfirmationMessage(
          "✅ Signup successful! Please check your inbox to confirm your email before logging in."
        );
        return;
      }

      router.push("/onboarding");
    }
  };

  const handleGoogleSignIn = async () => {
    const redirectTo =
      mode === "signup"
        ? "https://flairselect.vercel.app/auth/callback?from=onboarding"
        : "https://flairselect.vercel.app/auth/callback?from=dashboard";
  
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
  
    if (error) {
      console.error("Google sign-in error:", error.message);
    }
  };
  
  

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24">
      <div className="bg-white rounded-2xl shadow-xl p-14 w-full max-w-xl">
        {confirmationMessage && (
          <div className="mb-6 px-4 py-3 rounded text-green-800 bg-green-100 border border-green-300 text-center font-medium text-sm">
            {confirmationMessage}
          </div>
        )}

        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-4 py-2 font-semibold rounded ${
              isLogin
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleToggleMode("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded ${
              !isLogin
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleToggleMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Who Are You?</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
                >
                  <option value="agency">Agency</option>
                  <option value="brand">Brand</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Company Name</label>
                <input
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
                  placeholder="e.g. Flair Marketing Co."
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-4 text-lg rounded-lg hover:bg-red-700 transition-colors"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <hr className="my-6 border-t border-gray-200" />

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-gray-900 border-2 border-gray-200 py-4 text-lg font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <FaGoogle className="text-lg text-blue-600" />
            {isLogin ? "Login In with Google" : "Sign Up with Google"}
          </button>
        </form>
      </div>
    </main>
  );
}
