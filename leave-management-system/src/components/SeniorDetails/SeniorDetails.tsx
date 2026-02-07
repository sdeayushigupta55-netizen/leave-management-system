import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UserContext";
import SeniorOfficersCard from "../SeniorDetails/SeniorOfficersCard";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";

const SeniorDetails = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { users } = useUsers();

  if (!user) return null;

  const getApprovingOfficers = () => {
    if (user.rank === "CONSTABLE" || user.rank === "HEAD_CONSTABLE") {
      const approvers = [
        { rank: "SSP", maxDays: null, label: "8+ days / EL" },
        { rank: "SP", maxDays: 15, label: "8-15 days" },
        { rank: "CO", maxDays: 7, label: "4-7 days" },
        { rank: "SHO/SO", maxDays: 3, label: "Up to 3 days" },
        ];

      return approvers.map((approver) => {
        const officer = users.find(
          (u) =>
            u.rank === approver.rank &&
            u.isActive &&
            (approver.rank === "SHO/SO"
              ? u.policeStation === user.policeStation
              : approver.rank === "CO"
              ? u.circleOffice === user.circleOffice
              : true)
        );

        return {
          ...approver,
          name: officer?.name || "Not Assigned",
          contact: officer?.contact || "-",
          pno: officer?.pno || "-",
        };
      });
    }

    if (user.rank === "SHO/SO"|| user.rank === "SI" || user.rank === "INSPECTOR" || user.rank === "CO") {
      const approvers = [
        { rank: "SP", label: "SP" },
        { rank: "SSP", label: "SSP" },
      ];

      return approvers.map((approver) => {
        const officer = users.find(
          (u) => u.rank === approver.rank && u.isActive
        );

        return {
          ...approver,
          maxDays: null,
          name: officer?.name || "Not Assigned",
          contact: officer?.contact || "-",
          pno: officer?.pno || "-",
        };
      });
    }
    if (user.rank === "SP") {
      const approver = users.find(
        (u) => u.rank === "SSP" && u.isActive
      );

      return [
        {
          rank: "SSP",
          label: "SSP",
          maxDays: null,
          name: approver?.name || "Not Assigned",
          contact: approver?.contact || "-",
          pno: approver?.pno || "-",
        },
      ];
    }

    return [];
  };

  const officers = getApprovingOfficers();

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen space-y-4 md:space-y-6 flex flex-col p-2 md:p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#303f9f] rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg border-b-4 border-[#c5a200]">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-[#c5a200]/30 rounded-lg md:rounded-xl backdrop-blur-sm border border-[#c5a200]/50">
              <Users size={24} className="text-[#ffd54f] md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{t("seniorDetails")}</h1>
              <p className="text-blue-100 text-sm md:text-base mt-0.5 md:mt-1">{t("viewSeniorOfficers") || "View your approving officers hierarchy"}</p>
            </div>
          </div>
        </div>

        {/* Officers List */}
        {officers.length > 0 ? (
          <SeniorOfficersCard officers={officers} />
        ) : (
          <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 text-center border border-gray-100 shadow-sm">
            <Users size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{t("noSeniorOfficers") || "No senior officers information available for your rank."}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SeniorDetails;