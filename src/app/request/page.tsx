"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { loadStripe } from "@stripe/stripe-js";
import Select from "react-select";

const PLATFORM_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "x", label: "X (Twitter)" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
];
const ONLY_IG = [{ value: "instagram", label: "Instagram" }];

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function RequestForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTier =
    (searchParams.get("tier") as
      | "list_only"
      | "list_plus_dm"
      | "integration_setup"
      | "integration_subscription") || "list_only";

  const [formData, setFormData] = useState({
    campaignName: "",
    niche: "",
    platforms: [] as string[],
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
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialTier === "list_plus_dm") {
      setFormData((prev) => ({ ...prev, platforms: ["instagram"] }));
    }
  }, [initialTier]);

  const isListPlus = initialTier === "list_plus_dm";
  const platformOptions = isListPlus ? ONLY_IG : PLATFORM_OPTIONS;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const uploadPdfAndGetPath = async (): Promise<string | null> => {
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
      const { error: uploadErr } = await supabase
        .storage
        .from("requests-briefs")
        .upload(filePath, pdfFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: "application/pdf",
        });
      if (uploadErr) throw uploadErr;

      return filePath;
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
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/forms?mode=login");
        return;
      }

      let briefPath: string | null = null;
      if (pdfFile) briefPath = await uploadPdfAndGetPath();

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          tier: initialTier,
          form: {
            campaignName: formData.campaignName || null,
            niche: formData.niche || null,
            platforms: formData.platforms.join(",") || null,
            minFollowers: formData.minFollowers || null,
            maxFollowers: formData.maxFollowers || null,
            minViews: formData.minViews || null,
            maxViews: formData.maxViews || null,
            gender: formData.gender || null,
            race: formData.race || null,
            location: formData.location || null,
            language: formData.language || null,
            budget: formData.budget || null,
            engagementRate: formData.engagementRate || null,
            notes: formData.notes || null,
            briefPath,
          },
        }),
      });

      if (res.status === 401) {
        router.push("/forms?mode=login");
        return;
      }

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Failed to start checkout.");
      }

      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load.");
      await stripe.redirectToCheckout({ sessionId });
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-base focus:ring-2 focus:ring-red-300 outline-none text-gray-900";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
  {/* Back to Home fixed at top-left */}
  <div className="absolute top-6 left-6">
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-gray-800 bg-gray-100 border border-gray-300 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors"
      aria-label="Back to Home"
    >
      ← Back to Home
    </Link>
  </div>

      <div className="flex items-start justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl space-y-5 border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 text-center">
            Request Influencer Campaign
          </h2>

          {errorMessage && (
            <p className="text-red-600 text-center">{errorMessage}</p>
          )}

          {/* Campaign Form Fields */}
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

            {/* Platform Multi-select */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Platform<span className="text-red-500">*</span>
                {!isListPlus && (
                  <span className="block text-xs font-normal text-gray-500">
                    Select one or more
                  </span>
                )}
              </label>
              <Select
                isMulti
                isSearchable={false}
                instanceId="platforms"
                options={platformOptions}
                value={platformOptions.filter((o) =>
                  formData.platforms.includes(o.value)
                )}
                onChange={(vals) => {
                  const arr = (vals ?? []).map((v) => v.value);
                  setFormData((prev) => ({ ...prev, platforms: arr }));
                }}
                isClearable={false}
                classNamePrefix="rs"
                className="text-gray-900"
              />
            </div>

            {/* Min Followers */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Min Followers
              </label>
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

            {/* Min Avg Views */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Min Avg Views
                <span className="block text-xs font-normal text-gray-500">
                  (Leave blank if no minimum)
                </span>
              </label>
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

            {/* Gender */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Gender
              </label>
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
              <label className="block mb-1 font-medium text-gray-700">
                Race & Ethnicity
              </label>
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
              <label className="block mb-1 font-medium text-gray-700">
                Location
              </label>
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
              <label className="block mb-1 font-medium text-gray-700">
                Language
              </label>
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
              <label className="block mb-1 font-medium text-gray-700">
                Budget ($)
              </label>
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
                className={inputClass}
              />
            </div>
          </div>

          {/* Divider before Supplemental Section */}
          <div className="relative my-6">
            <div className="h-px bg-gray-200" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs font-semibold tracking-widest text-gray-500">
              Supplemental Details
            </span>
          </div>

          {/* PDF Upload Section */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Upload Campaign Brief (PDF)
            </label>
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 text-center transition ${
                isDragging ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"
              }`}
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
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Include anything else we should know..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-red-600 text-white font-bold py-3 text-base rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Starting Checkout..." : "Submit & Pay"}
          </button>
        </form>
      </div>
    </main>
  );
}
