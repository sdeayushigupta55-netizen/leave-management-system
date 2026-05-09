import React, { useState, useEffect, useMemo } from "react";
import { useBeatBook } from "../../context/BeatBookContext";
import { useAuth } from "../../context/AuthContext";
import type {
  PopulationDetailsVillage,
  VillageSubCastePopulation,
} from "../../type/beatbook";
import { usePopulationDetails } from "../../context/PopulationDetailsContext";
import { API_BASE_URL } from "../../config";
import {
  Users,
  MapPin,
  Plus,
  Trash2,
  Save,
  Shield,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

type Religion = {
  _id: string;
  name: string;
};

type SubCaste = {
  _id: string;
  religionId: string;
  name: string;
};

const PopulationDetailsPage: React.FC = () => {
  const { user } = useAuth();
  const { beatBooks } = useBeatBook();
  const userBeatBook = beatBooks.find((b) => String(b.userId) === String(user?._id));

  const [religions, setReligions] = useState<Religion[]>([]);
  const [subCastes, setSubCastes] = useState<SubCaste[]>([]);
  const [populationDetails, setPopulationDetails] = useState<PopulationDetailsVillage[]>([]);
  const { addPopulationDetails, updatePopulationDetails } = usePopulationDetails();

  // Fetch religions and subcastes on mount
  useEffect(() => {
    fetch("/api/population-details/religions")
      .then((res) => res.json())
      .then((data) => setReligions(data));
    fetch("/api/population-details/sub-castes")
      .then((res) => res.json())
      .then((data) => setSubCastes(data));
  }, []);

  // Always fetch population details from backend on load
  useEffect(() => {
    if (userBeatBook) {
      fetch(`${API_BASE_URL}/population-details?beatId=${userBeatBook._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setPopulationDetails(data);
          } else {
            // Only initialize if backend has no data
            setPopulationDetails(
              userBeatBook.villages.map((village) => ({
                beatId: userBeatBook._id!,
                villageName: village.name,
                totalPopulation: 0,
                religions: [],
              }))
            );
          }
        });
    }
  }, [userBeatBook]);

  const handleReligionSelect = (villageIdx: number, religionId: string) => {
    setPopulationDetails((details) =>
      details.map((v, i) => {
        if (i !== villageIdx) return v;
        if (v.religions.some((r) => r.religionId === religionId)) return v;
        return { ...v, religions: [...v.religions, { religionId, subCastes: [] }] };
      })
    );
  };

  const addSubCaste = (villageIdx: number, religionIdx: number) => {
    setPopulationDetails((details) =>
      details.map((v, vi) => {
        if (vi !== villageIdx) return v;
        const updatedReligions = v.religions.map((r, ri) => {
          if (ri !== religionIdx) return r;
          return {
            ...r,
            subCastes: [...r.subCastes, { subCasteId: "", population: 0 }],
          };
        });
        return { ...v, religions: updatedReligions };
      })
    );
  };

  const handleSave = async () => {
    let success = true;
    let updatedDetails: PopulationDetailsVillage[] = [...populationDetails];

    for (let i = 0; i < populationDetails.length; i++) {
      const detail = populationDetails[i];
      if (
        detail.religions.length === 0 ||
        detail.religions.some((r) => r.subCastes.length === 0)
      ) {
        alert(`Village "${detail.villageName}" has missing religions or subcastes.`);
        success = false;
        continue;
      }
      let result;
      if (detail._id && detail._id.length === 24) {
        result = await updatePopulationDetails(detail._id, detail);
      } else {
        result = await addPopulationDetails(detail);
      }
      if (result) updatedDetails[i] = result;
      if (!result) success = false;
    }

    setPopulationDetails(updatedDetails);

    // Always fetch latest data from backend after save
    if (userBeatBook) {
      fetch(`${API_BASE_URL}/population-details?beatId=${userBeatBook._id}`)
        .then((res) => res.json())
        .then((data) => setPopulationDetails(data));
    }

    if (success) alert("Population data saved!");
    else alert("Failed to save population data. Please check your backend.");
  };

  const handleSubCasteChange = (
    villageIdx: number,
    religionIdx: number,
    subCasteIdx: number,
    field: keyof VillageSubCastePopulation,
    value: any
  ) => {
    setPopulationDetails((details) =>
      details.map((v, vi) => {
        if (vi !== villageIdx) return v;
        const updatedReligions = [...v.religions];
        updatedReligions[religionIdx].subCastes[subCasteIdx] = {
          ...updatedReligions[religionIdx].subCastes[subCasteIdx],
          [field]: value,
        };
        return { ...v, religions: updatedReligions };
      })
    );
  };

  const removeSubCaste = (villageIdx: number, religionIdx: number, subCasteIdx: number) => {
    setPopulationDetails((details) =>
      details.map((v, vi) => {
        if (vi !== villageIdx) return v;
        const updatedReligions = [...v.religions];
        updatedReligions[religionIdx].subCastes =
          updatedReligions[religionIdx].subCastes.filter((_, i) => i !== subCasteIdx);
        return { ...v, religions: updatedReligions };
      })
    );
  };

  const getVillageTotal = (v: PopulationDetailsVillage) =>
    v.religions.reduce(
      (sum, religion) =>
        sum +
        religion.subCastes.reduce((s, sub) => s + (Number(sub.population) || 0), 0),
      0
    );

  const villagesCount = populationDetails.length;

  // quick lookups for labels (keeps UI clean)
  const religionNameById = useMemo(() => {
    const map = new Map<string, string>();
    religions.forEach((r) => map.set(r._id, r.name));
    return map;
  }, [religions]);

  const subCasteNameById = useMemo(() => {
    const map = new Map<string, string>();
    subCastes.forEach((s) => map.set(s._id, s.name));
    return map;
  }, [subCastes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ">
      <div className="max-w-6xl mx-auto ">
        {/* Page Shell */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#303f9f] rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg border-b-4 border-[#c5a200]"/>
            <div className="relative p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                 <div className="p-2 md:p-3 bg-[#c5a200]/30 rounded-lg md:rounded-xl backdrop-blur-sm border border-[#c5a200]/50">
                             <Sparkles size={24} className="text-[#ffd54f] md:w-8 md:h-8" />
                           </div>

                <div></div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      Population Details
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <Users size={14} />
                      Villages: {villagesCount}
                    </span>
                  </div>
                  <p className="text-sm text-white mt-1">
                    Manage village religion and subcaste population distribution.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold shadow-sm hover:bg-emerald-700 transition"
                >
                  <Save size={18} />
                  Save All Villages
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            {!userBeatBook && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2 mb-6">
                <AlertTriangle size={18} className="mt-0.5" />
                <div className="font-semibold">
                  BeatBook not found for this user. Please fill General Details first.
                </div>
              </div>
            )}

            {/* Village Cards */}
            <div className="space-y-7">
              {populationDetails.map((village, vIdx) => {
                // NOTE: UI-only total (no logic changed; still shows computed total)
                const total = getVillageTotal(village);

                return (
                  <div
                    key={village._id || vIdx}
                    className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
                  >
                    {/* Village Header */}
                    <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-white to-slate-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
                          <MapPin className="text-indigo-700" size={18} />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                            {village.villageName}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Beat ID: <span className="font-semibold">{village.beatId}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 font-extrabold">
                          <Shield size={16} />
                          Total: {total}
                        </span>

                        <button
                          type="button"
                          onClick={async () => {
                            const detail = populationDetails[vIdx];
                            if (
                              detail.religions.length === 0 ||
                              detail.religions.some((r) => r.subCastes.length === 0)
                            ) {
                              alert(
                                `Village "${detail.villageName}" has missing religions or subcastes.`
                              );
                              return;
                            }
                            let result;
                            if (detail._id && detail._id.length === 24) {
                              result = await updatePopulationDetails(detail._id, detail);
                            } else {
                              result = await addPopulationDetails(detail);
                            }
                            if (result) {
                              setPopulationDetails((prev) =>
                                prev.map((v, idx) => (idx === vIdx ? result : v))
                              );
                              alert(`Population data for "${detail.villageName}" saved!`);
                            } else {
                              alert(
                                `Failed to save population data for "${detail.villageName}".`
                              );
                            }
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                        >
                          <CheckCircle2 size={16} />
                          Save
                        </button>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      {/* Add Religion */}
                      <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="text-sm font-extrabold text-gray-800">
                              Add Religion
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Select a religion to start adding subcastes.
                            </p>
                          </div>

                          <div className="relative w-full sm:w-[320px]">
                            <select
                              value=""
                              onChange={(e) => handleReligionSelect(vIdx, e.target.value)}
                              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                            >
                              <option value="">-- Select Religion --</option>
                              {religions
                                .filter(
                                  (r) =>
                                    !village.religions.some((rel) => rel.religionId === r._id)
                                )
                                .map((r) => (
                                  <option key={r._id} value={r._id}>
                                    {r.name}
                                  </option>
                                ))}
                            </select>
                            <ChevronDown
                              size={18}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Religions */}
                      <div className="mt-5 space-y-5">
                        {village.religions.map((religion, rIdx) => {
                          const relName =
                            typeof religion.religionId === "object"
                              ? (religion.religionId as { name: string }).name
                              : religionNameById.get(String(religion.religionId)) || "";

                          const filteredSubCastes = subCastes.filter(
                            (sc) => sc.religionId === religion.religionId
                          );

                          return (
                            <div
                              key={rIdx}
                              className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
                            >
                              {/* Religion Header */}
                              <div className="px-4 py-3 bg-gradient-to-r from-white to-indigo-50 border-b border-gray-100 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                                  <h4 className="text-sm sm:text-base font-extrabold text-gray-800">
                                    {relName}
                                  </h4>
                                  <span className="text-xs font-semibold text-gray-500">
                                    Subcastes: {religion.subCastes.length}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => addSubCaste(vIdx, rIdx)}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition"
                                >
                                  <Plus size={16} />
                                  Add SubCaste
                                </button>
                              </div>

                              {/* SubCaste Rows */}
                              <div className="p-4 space-y-3">
                                {religion.subCastes.map((sub, sIdx) => {
                                  const subLabel =
                                    typeof sub.subCasteId === "object"
                                      ? (sub.subCasteId as { name: string }).name
                                      : subCasteNameById.get(String(sub.subCasteId)) || "";

                                  return (
                                    <div
                                      key={sIdx}
                                      className="rounded-2xl border border-gray-100 bg-slate-50 p-3 sm:p-4"
                                    >
                                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                        {/* Subcaste dropdown */}
                                        <div className="md:col-span-7">
                                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                                            SubCaste
                                          </label>
                                          <div className="relative">
                                            <select
                                              value={sub.subCasteId}
                                              onChange={(e) =>
                                                handleSubCasteChange(
                                                  vIdx,
                                                  rIdx,
                                                  sIdx,
                                                  "subCasteId",
                                                  e.target.value
                                                )
                                              }
                                              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                                            >
                                              <option value="">-- Select SubCaste --</option>
                                              {filteredSubCastes.map((sc) => (
                                                <option key={sc._id} value={sc._id}>
                                                  {sc.name}
                                                </option>
                                              ))}
                                            </select>
                                            <ChevronDown
                                              size={18}
                                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                            />
                                          </div>
                                          {!!subLabel && (
                                            <div className="mt-1 text-xs text-gray-500">
                                              Selected:{" "}
                                              <span className="font-semibold text-gray-700">
                                                {subLabel}
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        {/* Population */}
                                        <div className="md:col-span-3">
                                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                                            Population
                                          </label>
                                          <input
                                            type="number"
                                            value={sub.population}
                                            onChange={(e) =>
                                              handleSubCasteChange(
                                                vIdx,
                                                rIdx,
                                                sIdx,
                                                "population",
                                                Number(e.target.value)
                                              )
                                            }
                                            placeholder="Population"
                                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                                          />
                                        </div>

                                        {/* Remove */}
                                        <div className="md:col-span-2 flex md:justify-end">
                                          <button
                                            type="button"
                                            onClick={() => removeSubCaste(vIdx, rIdx, sIdx)}
                                            className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-3 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-700 font-extrabold hover:bg-red-100 transition"
                                          >
                                            <Trash2 size={16} />
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}

                                {religion.subCastes.length === 0 && (
                                  <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                                    No subcaste added yet. Click{" "}
                                    <span className="font-bold text-indigo-700">
                                      Add SubCaste
                                    </span>{" "}
                                    to begin.
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {village.religions.length === 0 && (
                          <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                            No religion added yet. Use{" "}
                            <span className="font-bold text-indigo-700">Add Religion</span>{" "}
                            above.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold shadow-sm hover:bg-emerald-700 transition"
              >
                <Save size={18} />
                Save All Villages
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopulationDetailsPage;