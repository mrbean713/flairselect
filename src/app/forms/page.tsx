"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

export default function Forms() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode");

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Agency",
    company: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (mode === "signup") setIsLogin(false);
    if (mode === "login") setIsLogin(true);
  }, [mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (isLogin) {
      // LOGIN FLOW
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setMessage("Login failed: " + error.message);
      } else {
        router.push("/dashboard");
      }

    } else {
      // SIGNUP FLOW
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            company_name: formData.company,
            company_type: formData.role,
          }
        }
      });

      if (signUpError) {
        setMessage("Signup failed: " + signUpError.message);
        return;
      }

      setMessage("✅ Signup successful! Please check your email to confirm.");
    }
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/onboarding`,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      {message && (
        <div
          className={`mb-4 text-center p-2 rounded ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 rounded-l ${isLogin ? "bg-gray-300" : "bg-white border"}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 rounded-r ${!isLogin ? "bg-red-500 text-white" : "bg-white border"}`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />

        {!isLogin && (
          <>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="Agency">Agency</option>
              <option value="Brand">Brand</option>
            </select>

            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <hr className="my-6" />

      <button
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center border py-2 rounded hover:bg-gray-100"
      >
        <FaGoogle className="mr-2" /> Sign Up with Google
      </button>
    </div>
  );
}
