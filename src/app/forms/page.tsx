"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Forms() {
  const supabase = createClientComponentClient(); // ✅ helpers client
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") || "login";
  const isLogin = mode === "login";
  const launchingRef = useRef(false); // ✅ prevent double-launch

  useEffect(() => {
    console.log("🔎 [Forms] Page loaded with params:", {
      mode,
      next: searchParams.get("next"),
    });
  }, [mode, searchParams]);
  

  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // 🔔 Show a notice if they were redirected here before submitting a request
  useEffect(() => {
    const next = searchParams.get("next");
    if (next) {
      setConfirmationMessage("Please login before submitting a request.");
    }
  }, [searchParams]);

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

    // ✅ preserve intended destination, but if it was a request flow,
    // send them back to /pricing after login as asked
    const rawNext = searchParams.get("next") || (isLogin ? "/dashboard" : "/onboarding");
    const dest = rawNext.startsWith("/request") ? "/pricing" : rawNext;

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setConfirmationMessage("❌ Login failed: " + error.message);
        return;
      }

      router.push(dest); // 🔁 go where the user should land
    } else {
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

  // ✅ UPDATED: guard double clicks + clear stale sb-* pkce cookies before OAuth
  const handleGoogleSignIn = async () => {
    if (launchingRef.current) return;
    launchingRef.current = true;

    try {
      // Nuke any stale PKCE cookies that can cause "code challenge does not match"
      for (const c of document.cookie.split(";")) {
        const name = c.split("=")[0].trim();
        if (name.startsWith("sb-") && name.includes("pkce")) {
          // remove for current host
          document.cookie = `${name}=; Max-Age=0; path=/`;
          // try removing for parent domain (e.g., .vercel.app)
          const parts = window.location.hostname.split(".");
          if (parts.length >= 2) {
            const domain = `.${parts.slice(-2).join(".")}`;
            document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
          }
        }
      }

      const origin = window.location.origin; // ← localhost or vercel, automatically
      const rawNext = searchParams.get("next") || (isLogin ? "/dashboard" : "/onboarding");
      const dest = rawNext.startsWith("/request") ? "/pricing" : rawNext; // 🔁 after OAuth, land on pricing instead of request
      const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(dest)}`;

      console.log("🚀 [Forms] Launching Google OAuth", {
        mode,
        isLogin,
        origin: window.location.origin,
        next: dest,
        redirectTo,
      });

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        console.error("❌ [Forms] Google sign-in error:", error.message);
      } else {
        console.log("✅ [Forms] signInWithOAuth call succeeded — browser will redirect to Google");
      }
    } catch (e) {
      console.error("Google sign-in threw:", e);
      launchingRef.current = false;
    }
  };

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: "https://flairselect.vercel.app/update-password",
    });

    if (error) {
      setConfirmationMessage("❌ Reset failed: " + error.message);
    } else {
      setConfirmationMessage("✅ Password reset email sent!");
    }

    setForgotPasswordOpen(false);
    setResetEmail("");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24 relative">
      {/* Sticky Back to Home Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors shadow cursor-pointer"
      >
        ← Back to Home
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-14 w-full max-w-xl relative">
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
            } cursor-pointer`}
            onClick={() => handleToggleMode("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded ${
              !isLogin
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } cursor-pointer`}
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

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          )}

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
                  placeholder="e.g. The FLAIR Collective"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-4 text-lg rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <hr className="my-6 border-t border-gray-200" />

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-gray-900 border-2 border-gray-200 py-4 text-lg font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <FaGoogle className="text-lg text-blue-600" />
            {isLogin ? "Login with Google" : "Sign Up with Google"}
          </button>
        </form>

        {/* Forgot Password Modal */}
        {forgotPasswordOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-center text-gray-900">
                Reset Your Password
              </h2>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full mb-4 px-4 py-3 border border-gray-300 rounded text-gray-900"
              />
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setForgotPasswordOpen(false)}
                  className="w-1/2 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordReset}
                  className="w-1/2 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-medium cursor-pointer"
                >
                  Send Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
