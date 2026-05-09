// GeneralDetails.tsx
import React, { useState, useEffect } from "react";
import { useBeatBook } from "../context/BeatBookContext";
import InputField from "../ui/Input";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import Button from "../ui/Button";
import {
  FileText,
  User,
  Shield,
  Phone,
  MapPin,
  Hash,
  Users,
  Navigation,
  Pencil,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react";
import type { BeatBook, Village } from "../type/beatbook";

const initialData: BeatBook = {
  userId: "",
  beatNo: "",
  villages: [
    {
      name: "",
      latitude: "",
      longitude: "",
      casteData: [],
    },
  ],
  beatIncharge: "",
  beatInchargeMobile: "",
  alternateBeatConstableName: "",
  alternateBeatConstableMobile: "",
};

const GeneralDetails: React.FC = () => {
  const { user } = useAuth();
  const { beatBooks, addBeatBook, updateBeatBook, loading } = useBeatBook();

  const [form, setForm] = useState<BeatBook>(initialData);
  const [beatBookId, setBeatBookId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  // ------------------ Normal Input Change ------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // ------------------ Village Handlers ------------------
  const handleVillageChange = (
    index: number,
    field: keyof Village,
    value: string
  ) => {
    const updated = [...form.villages];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, villages: updated });
  };

  const addVillage = () => {
    setForm({
      ...form,
      villages: [
        ...form.villages,
        { name: "", latitude: "", longitude: "", casteData: [] },
      ],
    });
  };

  const removeVillage = (index: number) => {
    const updated = form.villages.filter((_, i) => i !== index);
    setForm({
      ...form,
      villages: updated.length
        ? updated
        : [{ name: "", latitude: "", longitude: "", casteData: [] }],
    });
  };

  // ------------------ Edit ------------------
  const handleEdit = () => {
    setIsDisabled(false);
    setSuccess("");
  };

  // ------------------ Submit ------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id) {
      setError("User not found.");
      return;
    }
    if (!form.beatNo?.trim()) {
      setError("Halka No is required.");
      return;
    }
    if (!form.villages.length || !form.villages[0].name.trim()) {
      setError("At least one village is required.");
      return;
    }

    try {
      const payload: BeatBook = { ...form, userId: user._id };
      let result;
      if (beatBookId) {
        result = await updateBeatBook(beatBookId, payload);
        setSuccess("Details updated successfully!");
      } else {
        result = await addBeatBook(payload);
        setSuccess("Details submitted successfully!");
        if (result?._id) setBeatBookId(result._id);
      }
      setError("");
      setIsDisabled(true);
    } catch (err) {
      setError("Failed to submit form.");
      setSuccess("");
    }
  };

  // ------------------ Prefill From Logged User ------------------
  useEffect(() => {
    if (!user || beatBookId) return;
    setForm((prev) => ({ ...prev, userId: user._id || "" }));
  }, [user]);

  // ------------------ Prefill Existing BeatBook ------------------
  useEffect(() => {
    if (!user || !beatBooks?.length) return;
    const existing = beatBooks.find(
      (b) => String(b.userId) === String(user._id)
    );
    if (existing) {
      setForm({
        ...initialData,
        ...existing,
        villages:
          existing.villages && existing.villages.length
            ? existing.villages
            : [{ name: "", latitude: "", longitude: "", casteData: [] }],
      });
      setBeatBookId(existing._id ?? null);
      setIsDisabled(true);
    }
  }, [beatBooks, user]);

  const villageCount = form.villages?.length ?? 0;

  return (
    <DashboardLayout>
      <div >
        {/* Page Shell */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#303f9f] rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg border-b-4 border-[#c5a200]" />
            <div className="relative p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 md:p-3 bg-[#c5a200]/30 rounded-lg md:rounded-xl backdrop-blur-sm border border-[#c5a200]/50">
                  <FileText size={24} className="text-[#ffd54f] md:w-8 md:h-8" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                      General Details
                    </h1>
                    {isDisabled ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 size={14} />
                        Saved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Pencil size={14} />
                        Editing
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white mt-1">
                    Fill out beat book general details. All fields can be edited using{" "}
                    <span className="font-semibold">Edit</span>.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                      <Users size={14} />
                      Villages: {villageCount}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                      <Hash size={14} />
                      Halka: {form.beatNo?.trim() ? form.beatNo : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2 justify-end">
                {isDisabled && (
                  <Button type="button" variant="gold" onClick={handleEdit}>
                    <span className="inline-flex items-center gap-2">
                      <Pencil size={16} />
                      Edit
                    </span>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="gold"
                  disabled={loading || isDisabled}
                  onClick={() => {
                    // keep logic: trigger submit by clicking actual submit button below if needed
                    // (no logic change; this is just a visual action button)
                    const formEl = document.getElementById(
                      "general-details-form"
                    ) as HTMLFormElement | null;
                    formEl?.requestSubmit();
                  }}
                >
                  {loading ? "Submitting..." : "Save"}
                </Button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6">
            {/* Alerts */}
            {(error || success) && (
              <div className="mb-5 space-y-2">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                    <AlertTriangle size={18} className="mt-0.5" />
                    <div className="font-medium">{error}</div>
                  </div>
                )}
                {success && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-start gap-2">
                    <CheckCircle2 size={18} className="mt-0.5" />
                    <div className="font-medium">{success}</div>
                  </div>
                )}
              </div>
            )}

            {/* User Summary Card */}
            <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-sm overflow-hidden mb-6">
              <div className="p-4 sm:p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm">
                      <Shield className="text-[#1a237e]" size={18} />
                    </div>
                    <p className="text-sm font-extrabold text-gray-800">
                      Officer Details
                    </p>
                  </div>

                  <div className="text-xs text-gray-500 font-semibold">
                    Auto-filled from profile
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <User size={14} />
                      Name
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-800">
                      {user?.name || "-"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <MapPin size={14} />
                      Police Station
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-800">
                      {user?.policeStation || "-"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <Phone size={14} />
                      Contact
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-800">
                      {user?.contact || "-"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <Shield size={14} />
                      Rank
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-800">
                      {user?.rank || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form id="general-details-form" onSubmit={handleSubmit}>
              {/* Section: Beat */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mb-6">
                <div className="px-4 sm:px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm">
                      <Hash className="text-[#1a237e]" size={16} />
                    </div>
                    <h2 className="text-sm font-extrabold text-gray-800">
                      Beat Details
                    </h2>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">
                    Required: Halka No, at least one Village
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Halka No"
                      name="beatNo"
                      value={form.beatNo}
                      onChange={handleChange}
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              </div>

              {/* Section: Villages */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mb-6">
                <div className="px-4 sm:px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm">
                      <Navigation className="text-[#1a237e]" size={16} />
                    </div>
                    <h2 className="text-sm font-extrabold text-gray-800">
                      Villages & Coordinates
                    </h2>
                  </div>

                  {!isDisabled && (
                    <button
                      type="button"
                      onClick={addVillage}
                      className="inline-flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-xl bg-[#1a237e] text-white shadow-sm hover:opacity-95"
                    >
                      <Plus size={16} />
                      Add Village
                    </button>
                  )}
                </div>

                <div className="p-4 sm:p-5 space-y-3">
                  {form.villages.map((village, vIndex) => (
                    <div
                      key={vIndex}
                      className="rounded-2xl border border-gray-200 bg-white p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-sm font-extrabold text-gray-800">
                            Village{" "}
                            <span className="text-[#1a237e]">
                              {village.name?.trim()
                                ? village.name
                                : `#${vIndex + 1}`}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Add village name and location coordinates.
                          </p>
                        </div>

                        {!isDisabled && form.villages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVillage(vIndex)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold text-sm hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-1">
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Village Name
                          </label>
                          <input
                            type="text"
                            value={village.name}
                            onChange={(e) =>
                              handleVillageChange(vIndex, "name", e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]"
                            placeholder="Village Name"
                            disabled={isDisabled}
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Latitude
                          </label>
                          <input
                            type="text"
                            value={village.latitude}
                            onChange={(e) =>
                              handleVillageChange(
                                vIndex,
                                "latitude",
                                e.target.value
                              )
                            }
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]"
                            placeholder="Latitude"
                            disabled={isDisabled}
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Longitude
                          </label>
                          <input
                            type="text"
                            value={village.longitude}
                            onChange={(e) =>
                              handleVillageChange(
                                vIndex,
                                "longitude",
                                e.target.value
                              )
                            }
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]"
                            placeholder="Longitude"
                            disabled={isDisabled}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {!isDisabled && (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                      Tip: Add correct latitude/longitude for accurate mapping.
                    </div>
                  )}
                </div>
              </div>

              {/* Section: Personnel */}
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="px-4 sm:px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm">
                      <Users className="text-[#1a237e]" size={16} />
                    </div>
                    <h2 className="text-sm font-extrabold text-gray-800">
                      Beat Staff Details
                    </h2>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">
                    Optional fields
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Beat Incharge Name"
                      name="beatIncharge"
                      value={form.beatIncharge}
                      onChange={handleChange}
                      disabled={isDisabled}
                    />
                    <InputField
                      label="Beat Incharge Mobile"
                      name="beatInchargeMobile"
                      value={form.beatInchargeMobile}
                      onChange={handleChange}
                      disabled={isDisabled}
                    />
                    <InputField
                      label="Alternate Beat Constable/HC Name"
                      name="alternateBeatConstableName"
                      value={form.alternateBeatConstableName}
                      onChange={handleChange}
                      disabled={isDisabled}
                    />
                    <InputField
                      label="Alternate Beat Constable/HC Mobile"
                      name="alternateBeatConstableMobile"
                      value={form.alternateBeatConstableMobile}
                      onChange={handleChange}
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs text-gray-500">
                  {isDisabled
                    ? "Click Edit to modify saved details."
                    : "Review and Save your changes."}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || isDisabled}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>

                  {isDisabled && (
                    <Button type="button" variant="gold" onClick={handleEdit}>
                      <span className="inline-flex items-center gap-2">
                        <Pencil size={16} />
                        Edit
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GeneralDetails;