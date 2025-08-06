"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function RequestForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    campaignName: "",
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
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to submit a request.");

      const { error } = await supabase.from("requests").insert([
        {
          campaign_name: formData.campaignName,
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

      router.push("/dashboard");

    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-base focus:ring-2 focus:ring-red-300 outline-none text-gray-900";

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl space-y-5 border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 text-center">
          Request Influencer Campaign
        </h2>

        {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campaign Name */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">
              Campaign Name<span className="text-red-500">*</span>
            </label>
            <input
              name="campaignName"
              value={formData.campaignName}
              onChange={handleChange}
              required
              placeholder="e.g. Summer 2025 Launch"
              className={inputClass}
            />
          </div>

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
              className={inputClass}
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
              className={inputClass}
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>

          {/* Min Followers */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Min Followers</label>
            <input
              name="minFollowers"
              type="number"
              value={formData.minFollowers}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Max Followers */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Max Followers</label>
            <input
              name="maxFollowers"
              type="number"
              value={formData.maxFollowers}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Min Avg Views */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Min Avg Views</label>
            <input
              name="minViews"
              type="number"
              value={formData.minViews}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Max Avg Views */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Max Avg Views</label>
            <input
              name="maxViews"
              type="number"
              value={formData.maxViews}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Gender</label>
            <input
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="e.g. Female, Male, Any"
              className={inputClass}
            />
          </div>

          {/* Race */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Race</label>
            <input
              name="race"
              value={formData.race}
              onChange={handleChange}
              placeholder="e.g. Asian, Black, Hispanic, Any"
              className={inputClass}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Los Angeles, USA"
              className={inputClass}
            />
          </div>

          {/* Language */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Language</label>
            <input
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="e.g. English, Spanish"
              className={inputClass}
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Budget ($)</label>
            <input
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g. 1000"
              className={inputClass}
            />
          </div>

          {/* Engagement Rate */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Engagement Rate (%)</label>
            <input
              name="engagementRate"
              type="number"
              step="0.1"
              value={formData.engagementRate}
              onChange={handleChange}
              placeholder="e.g. 5.2"
              className={inputClass}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Include anything else we should know..."
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white font-bold py-3 text-base rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </main>
  );
}
