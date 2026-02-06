import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UserContext";
import SeniorOfficersCard from "../SeniorDetails/SeniorOfficersCard";
import DashboardLayout from "../../layouts/DashboardLayout";

const SeniorDetails = () => {
  const { user } = useAuth();
  const { users } = useUsers();

  if (!user) return null;

  const getApprovingOfficers = () => {
    if (user.rank === "CONSTABLE" || user.rank === "HEAD_CONSTABLE") {
      const approvers = [
        { rank: "SHO/SO", maxDays: 3, label: "Up to 3 days" },
        { rank: "CO", maxDays: 7, label: "4-7 days" },
        { rank: "SP", maxDays: 15, label: "8-15 days" },
        { rank: "SSP", maxDays: null, label: "8+ days / EL" },
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
          uno: officer?.uno || "-",
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
          uno: officer?.uno || "-",
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
          uno: approver?.uno || "-",
        },
      ];
    }

    return [];
  };

  const officers = getApprovingOfficers();

  return (
    <DashboardLayout>
       <div className="w-full min-h-screen  space-y-6 flex flex-col">
      {/* 👮 Profile Card */}
      {officers.length > 0 ? (
          <SeniorOfficersCard officers={officers} />
        ) : (
          <p className="text-gray-500">No senior officers information available for your rank.</p>
        )}
      </div>
     
    </DashboardLayout>
  );
};

export default SeniorDetails;