import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useBeatBook } from "../context/BeatBookContext";
import { FaUserShield } from "react-icons/fa";
import Button from "../ui/Button";
import PopulationDetailsPage from "../pages/beatbook/PopulationDetailsPage";
import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config";
import type { PopulationDetailsVillage } from "../type/beatbook";

export function BeatBook() {
  const { user } = useAuth();
  const { beatBooks } = useBeatBook();

  const userBeatBook = beatBooks.find((b) => String(b.userId) === String(user?._id));

  // ---------- NEW: fetch population details here too (for print + summary) ----------
  const [populationDetails, setPopulationDetails] = useState<PopulationDetailsVillage[]>([]);
  const [popLoading, setPopLoading] = useState(false);

  useEffect(() => {
    if (!userBeatBook?._id) return;
    setPopLoading(true);
    fetch(`${API_BASE_URL}/population-details?beatId=${userBeatBook._id}`)
      .then((res) => res.json())
      .then((data) => setPopulationDetails(Array.isArray(data) ? data : []))
      .finally(() => setPopLoading(false));
  }, [userBeatBook?._id]);

  const villageTotals = useMemo(() => {
    return populationDetails.map((v) => {
      const total = (v.religions || []).reduce(
        (sum, r) =>
          sum +
          (r.subCastes || []).reduce((s, sc) => s + (Number(sc.population) || 0), 0),
        0
      );
      return { villageName: v.villageName, total };
    });
  }, [populationDetails]);

  const grandTotal = useMemo(() => {
    return villageTotals.reduce((s, x) => s + x.total, 0);
  }, [villageTotals]);

  return (
    <DashboardLayout>
      <div className="p-2 md:p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#303f9f] rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg border-b-4 border-[#c5a200] mb-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-[#c5a200]/30 rounded-lg md:rounded-xl backdrop-blur-sm border border-[#c5a200]/50">
              <FaUserShield size={24} className="text-[#ffd54f] md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Beat Book Dashboard</h1>
              <p className="text-blue-100 text-sm md:text-base mt-0.5 md:mt-1">
                Beat Book Overview
              </p>
            </div>
            <Button
              onClick={() => window.print()}
              variant="gold"
              className="ml-auto hidden md:inline-flex text-black"
            >
              Print Beat Book
            </Button>
          </div>
        </div>

        {/* =================== PRINT AREA START =================== */}
        {/* Everything inside this will be printable + client-ready */}
        <div id="print-area" className="space-y-6">
          {/* General Details */}
          {beatBooks && user && (
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-5 border-b pb-3">
                <div className="p-2 bg-[#e8eaf6] rounded-xl flex items-center justify-center">
                  <FaUserShield className="text-[#1a237e]" size={24} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1a237e]">
                  General Details
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-sm">
                <div className="flex">
                  <span className="w-44 font-semibold text-gray-600">Rank</span>
                  <span className="text-gray-800">: {user.rank || "N/A"}</span>
                </div>

                <div className="flex">
                  <span className="w-44 font-semibold text-gray-600">Name</span>
                  <span className="text-gray-800">: {user.name || "N/A"}</span>
                </div>

                <div className="flex">
                  <span className="w-44 font-semibold text-gray-600">Police Station</span>
                  <span className="text-gray-800">: {user.policeStation || "N/A"}</span>
                </div>

                <div className="flex">
                  <span className="w-44 font-semibold text-gray-600">Circle Office</span>
                  <span className="text-gray-800">: {user.circleOffice || "N/A"}</span>
                </div>

                <div className="flex">
                  <span className="w-44 font-semibold text-gray-600">Halka No</span>
                  <span className="text-blue-700 font-semibold">
                    : {userBeatBook?.beatNo || "N/A"}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-44 font-semibold text-gray-600">Beat Incharge</span>
                  <span className="text-gray-800">
                    : {userBeatBook?.beatIncharge || "N/A"}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-44 font-semibold text-gray-600">Contact</span>
                  <span className="text-gray-800">
                    : {userBeatBook?.beatInchargeMobile || "N/A"}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-44 font-semibold text-gray-600">
                    Alternate Constable/HC
                  </span>
                  <span className="text-gray-800">
                    : {userBeatBook?.alternateBeatConstableName || "N/A"}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-44 font-semibold text-gray-600">
                    Alternate Mobile
                  </span>
                  <span className="text-gray-800">
                    : {userBeatBook?.alternateBeatConstableMobile || "N/A"}
                  </span>
                </div>
              </div>

              {/* Village List */}
              <div className="mt-5 pt-4 border-t">
                <div className="font-semibold text-gray-700 mb-2">Villages</div>

                {userBeatBook?.villages?.length ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr className="text-left">
                          <th className="p-3 font-semibold text-gray-600">#</th>
                          <th className="p-3 font-semibold text-gray-600">Village</th>
                          <th className="p-3 font-semibold text-gray-600">Latitude</th>
                          <th className="p-3 font-semibold text-gray-600">Longitude</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userBeatBook.villages.map((v, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-3">{idx + 1}</td>
                            <td className="p-3 font-medium text-gray-800">{v.name || "-"}</td>
                            <td className="p-3">{(v as any).latitude || "-"}</td>
                            <td className="p-3">{(v as any).longitude || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No villages found.</div>
                )}
              </div>
            </div>
          )}

          {/* Population Summary (client printable) */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between gap-3 mb-5 border-b pb-3">
              <h2 className="text-xl font-bold text-[#1a237e]">Population Summary</h2>
              <div className="text-sm font-semibold text-gray-700">
                Grand Total: <span className="text-emerald-700">{grandTotal}</span>
              </div>
            </div>

            {popLoading ? (
              <div className="text-sm text-gray-500">Loading population details...</div>
            ) : villageTotals.length ? (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <th className="p-3 font-semibold text-gray-600">#</th>
                      <th className="p-3 font-semibold text-gray-600">Village</th>
                      <th className="p-3 font-semibold text-gray-600">Total Population</th>
                    </tr>
                  </thead>
                  <tbody>
                    {villageTotals.map((v, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3 font-medium text-gray-800">{v.villageName}</td>
                        <td className="p-3 font-semibold text-gray-900">{v.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                No population data found for this beat.
              </div>
            )}
          </div>

        
        </div>
        {/* =================== PRINT AREA END =================== */}
      </div>

      {/* Print styles */}
      <style>
        {`
          @media print {
            /* hide dashboard layout chrome if any */
            nav, aside, .no-print { display: none !important; }

            /* remove background */
            body { background: #fff !important; }

            /* make only print area visible */
            #print-area { display: block; }
            
            /* prevent ugly breaks */
            .page-break-avoid { break-inside: avoid; page-break-inside: avoid; }

            /* reduce shadow/border for clean print */
            .shadow-md, .shadow-lg, .hover\\:shadow-md, .hover\\:shadow-xl { box-shadow: none !important; }
          }
        `}
      </style>
    </DashboardLayout>
  );
}

export default BeatBook;