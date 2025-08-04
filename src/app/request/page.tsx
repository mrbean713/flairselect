"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function RequestForm() {
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    niche: "",
    platform: "instagram",
    minFollowers: "",
    maxFollowers: "",
    minViews: "",
    maxViews: "",
    gender: "",
    race: "",
    location: "",
    language: "",
    budget: "",
    engagementRate: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Get current logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to submit a request.");

      // Insert into Supabase
      const { error } = await supabase.from("requests").insert([
        {
          niche: formData.niche,
          platform: formData.platform,
          min_followers: formData.minFollowers ? Number(formData.minFollowers) : null,
          max_followers: formData.maxFollowers ? Number(formData.maxFollowers) : null,
          min_views: formData.minViews ? Number(formData.minViews) : null,
          max_views: formData.maxViews ? Number(formData.maxViews) : null,
          gender: formData.gender || null,
          race: formData.race || null,
          location: formData.location || null,
          language: formData.language || null,
          budget: formData.budget ? Number(formData.budget) : null,
          engagement_rate: formData.engagementRate ? Number(formData.engagementRate) : null,
          notes: formData.notes || null,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      setSuccessMessage("✅ Request submitted successfully!");
      setFormData({
        niche: "",
        platform: "instagram",
        minFollowers: "",
        maxFollowers: "",
        minViews: "",
        maxViews: "",
        gender: "",
        race: "",
        location: "",
        language: "",
        budget: "",
        engagementRate: "",
        notes: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-2xl space-y-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Request Influencer Campaign
        </h2>

        {successMessage && (
          <p className="text-green-600 text-center">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-center">{errorMessage}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Niche */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Niche<span className="text-red-500">*</span>
            </label>
            <input
              name="niche"
              value={formData.niche}
              onChange={handleChange}
              required
              placeholder="e.g. Fashion, Tech, Beauty"
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Platform<span className="text-red-500">*</span>
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>

          {/* Min/Max Followers */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Min Followers
            </label>
            <input
              name="minFollowers"
              type="number"
              value={formData.minFollowers}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Max Followers
            </label>
            <input
              name="maxFollowers"
              type="number"
              value={formData.maxFollowers}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          {/* Min/Max Views */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Min Avg Views
            </label>
            <input
              name="minViews"
              type="number"
              value={formData.minViews}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Max Avg Views
            </label>
            <input
              name="maxViews"
              type="number"
              value={formData.maxViews}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          {/* Gender & Race */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Gender
            </label>
            <input
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="e.g. Female, Male, Any"
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Race
            </label>
            <input
              name="race"
              value={formData.race}
              onChange={handleChange}
              placeholder="e.g. Asian, Black, Hispanic, Any"
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Location
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Los Angeles, USA"
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Language
            </label>
            <input
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="e.g. English, Spanish"
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Budget ($)
            </label>
            <input
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g. 1000"
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>

          {/* Engagement Rate */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Engagement Rate (%)
            </label>
            <input
              name="engagementRate"
              type="number"
              step="0.1"
              value={formData.engagementRate}
              onChange={handleChange}
              placeholder="e.g. 5.2"
              className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-5 py-3 text-lg focus:ring-2 focus:ring-red-300 outline-none text-gray-900 resize-none"
            placeholder="Include anything else we should know..."
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white font-bold py-4 text-lg rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </main>
  );
}
