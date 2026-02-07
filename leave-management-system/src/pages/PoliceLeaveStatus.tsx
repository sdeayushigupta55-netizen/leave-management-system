import { useState } from "react";
import { useLeaves } from "../context/LeaveContext";
import LeaveStatusTable from "../components/leave/LeaveStatusTable";
import LeaveStatusCard from "../components/leave/LeaveStatusCard";
import DashboardLayout from "../layouts/DashboardLayout";
import { useTranslation } from "react-i18next";
import type { LeaveStatus } from "../type/leave";
import { useAuth } from "../context/AuthContext";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const ROWS_PER_PAGE = 10;

const PoliceLeaveStatus = () => {
  const { t } = useTranslation();
  const { leaves, editLeave } = useLeaves();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "ALL">("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const parseLeaveDate = (dateStr: string) => {
    const [monthStr, dayStr] = dateStr.split(" ");
    const month = new Date(`${monthStr} 1, 2000`).getMonth();
    const day = parseInt(dayStr, 10);
    const year = new Date().getFullYear();
    return new Date(year, month, day);
  };

  const myLeaves = leaves.filter((leave) => leave.applicantId === user?.id);

  const filteredLeaves = myLeaves.filter((leave) => {
    const statusMatch = statusFilter === "ALL" || leave.status === statusFilter;
    const leaveFrom = parseLeaveDate(leave.from);
    const leaveTo = parseLeaveDate(leave.to);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    let dateMatch = true;
    if (from && to) dateMatch = leaveFrom >= from && leaveTo <= to;
    else if (from) dateMatch = leaveFrom >= from;
    else if (to) dateMatch = leaveTo <= to;

    return statusMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredLeaves.length / ROWS_PER_PAGE);
  const paginatedLeaves = filteredLeaves.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen p-2 sm:p-4 md:p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#e8eaf6] rounded-xl">
                <FileText className="text-[#1a237e]" size={24} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1a237e]">{t("leaveStatus")}</h1>
                <p className="text-sm text-gray-500">{t("trackLeaveApplications")}</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate("/police/apply-leave")}
              className="w-full sm:w-auto"
            >
              {t("applyLeave")}
            </Button>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-3">
              <input
                type="date"
                className="flex-1 min-w-[140px] border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-[#1a237e] focus:outline-none transition-colors"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                className="flex-1 min-w-[140px] border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-[#1a237e] focus:outline-none transition-colors"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <select
                className="flex-1 min-w-[120px] border-2 border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-[#1a237e] focus:outline-none transition-colors"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LeaveStatus | "ALL")}
              >
                <option value="ALL">{t("allStatus")}</option>
                <option value="PENDING">{t("pending")}</option>
                <option value="APPROVED">{t("approved")}</option>
                <option value="REJECTED">{t("rejected")}</option>
                <option value="DRAFT">{t("draft")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <LeaveStatusTable
            leaves={paginatedLeaves}
            onEdit={(leave) => editLeave(leave.id, leave)}
          />
        </div>

        <div className="md:hidden">
          <LeaveStatusCard
            leaves={paginatedLeaves}
            onEdit={(leave) => editLeave(leave.id, leave)}
          />
        </div>

        {filteredLeaves.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center">
            <p className="text-gray-500 text-sm sm:text-base">{t("noLeaveRecords")}</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4 text-sm bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <span className="text-gray-600">
              {t("showingResults")} {(page - 1) * ROWS_PER_PAGE + 1}-
              {Math.min(page * ROWS_PER_PAGE, filteredLeaves.length)} {t("of")} {filteredLeaves.length}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={handlePrev}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#1a237e] hover:text-[#1a237e] transition font-medium"
              >
                {t("prev")}
              </button>
              <button
                disabled={page === totalPages}
                onClick={handleNext}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#1a237e] hover:text-[#1a237e] transition font-medium"
              >
                {t("next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PoliceLeaveStatus;