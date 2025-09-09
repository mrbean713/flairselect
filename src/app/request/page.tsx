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
  const [errorMessage, setErrorMessage] = useState("");

  // NEW: PDF brief state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [briefUrl, setBriefUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // NEW: Handle file select (input) + drag/drop
  const onFileSelected = (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrorMessage("Please upload a PDF file.");
      return;
    }
    setErrorMessage("");
    setPdfFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // NEW: Upload PDF to Storage, return URL (public or signed)
  const uploadPdfAndGetUrl = async (): Promise<string | null> => {
    if (!pdfFile) return null;

    setUploading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to upload a brief.");

      const filePath = `${user.id}/${Date.now()}-${pdfFile.name}`;

      // Upload
      const { error: uploadErr } = await supabase.storage
        .from("requests-briefs")
        .upload(filePath, pdfFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: "application/pdf",
        });
      if (uploadErr) throw uploadErr;

      // Get a URL (choose one):
      // Option A: Public URL (bucket/object must be public)
      // const { data: pub } = supabase.storage.from("requests-briefs").getPublicUrl(filePath);
      // return pub?.publicUrl ?? null;

      // Option B: Signed URL (recommended for private buckets)
      const { data: signed, error: signedErr } = await supabase.storage
        .from("requests-briefs")
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days
      if (signedErr) throw signedErr;

      return signed?.signedUrl ?? null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to submit a request.");

      // If a PDF is present, upload first and capture URL
      let finalBriefUrl = briefUrl;
      if (pdfFile && !briefUrl) {
        finalBriefUrl = await uploadPdfAndGetUrl();
        setBriefUrl(finalBriefUrl);
      }

      const { error } = await supabase.from("requests").insert([
        {
          campaign_name: formData.campaignName || null,
          niche: formData.niche || null,
          platform: formData.platform || null,
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
          brief_url: finalBriefUrl, // NEW
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

  // NEW: Quick submit with PDF only
  const handlePdfOnlySubmit = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to submit a request.");

      if (!pdfFile) throw new Error("Please attach a PDF brief first.");

      const url = await uploadPdfAndGetUrl();
      if (!url) throw new Error("Failed to upload brief.");

      // Create minimal request row using file name for campaign_name fallback
      const { error } = await supabase.from("requests").insert([
        {
          campaign_name: formData.campaignName || pdfFile.name.replace(/\.pdf$/i, ""),
          niche: formData.niche || null,
          platform: formData.platform || null,
          brief_url: url,
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

        {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

        {/* NEW: Drag-and-drop PDF brief */}
        <div className="space-y-2">
          <label className="block font-medium text-gray-700">
            Upload Campaign Brief (PDF)
          </label>

          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 text-center transition
              ${isDragging ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"}`}
          >
            <p className="text-sm text-gray-700">
              Drag & drop your PDF here, or click to select.
            </p>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFileSelected(f);
              }}
              className="hidden"
              id="briefInput"
            />
            <label
              htmlFor="briefInput"
              className="cursor-pointer inline-block bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
            >
              {pdfFile ? "Change PDF" : "Choose PDF"}
            </label>

            {pdfFile && (
              <div className="text-xs text-gray-600 mt-1">
                Selected: <span className="font-medium">{pdfFile.name}</span>
              </div>
            )}
            {uploading && (
              <div className="text-xs text-gray-500 mt-1">Uploading…</div>
            )}
          </div>

          {/* Optional: quick submit with PDF only */}
          <button
            type="button"
            onClick={handlePdfOnlySubmit}
            disabled={loading || !pdfFile}
            className="w-full bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Submit with PDF Only
          </button>
        </div>
        

            {/* --- OR divider --- */}
    <div className="relative my-6">
      <div className="h-px bg-gray-200" />
      <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs font-semibold tracking-widest text-gray-500">
        OR
      </span>
    </div>
        {/* —— existing form —— */}
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
              className={inputClass}
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="x">X (Twitter)</option>
              <option value="youtube">YouTube</option>
              <option value="linkedin">LinkedIn</option>
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
  <label className="block mb-1 font-medium text-gray-700">
    Max Followers
    <span className="block text-xs font-normal text-gray-500">
      (Leave blank if no maximum)
    </span>
  </label>
  <input
    name="maxFollowers"
    type="number"
    value={formData.maxFollowers}
    onChange={handleChange}
    className={inputClass}
  />
</div>

{/* Max Avg Views */}
<div>
  <label className="block mb-1 font-medium text-gray-700">
    Max Avg Views
    <span className="block text-xs font-normal text-gray-500">
      (Leave blank if no maximum)
    </span>
  </label>
  <input
    name="maxViews"
    type="number"
    value={formData.maxViews}
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
            <label className="block mb-1 font-medium text-gray-700">Race & Ethnicity</label>
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
          disabled={loading || uploading}
          className="w-full bg-red-600 text-white font-bold py-3 text-base rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </main>
  );
}
