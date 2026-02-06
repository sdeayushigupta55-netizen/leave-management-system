import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useLeave } from "../context/LeaveContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { LeaveType } from "../type/leave";
import Select from "../ui/Select";
import InputField from "../ui/Input";

interface FormState {
  leaveType?: LeaveType;
  from: string;
  to: string;
  reason: string;
}

const ApplyLeave = () => {
  const { t } = useTranslation();
  const { leaves, addLeave, editLeave } = useLeave();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editingId = location.state?.leaveId;

  const [form, setForm] = useState<FormState>({
    leaveType: undefined,
    from: "",
    to: "",
    reason: "",
  });

  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const calculateDays = (from: string, to: string): number => {
    if (!from || !to) return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = toDate.getTime() - fromDate.getTime();
    return Math.abs(Math.round(diffTime / (1000 * 60 * 60 * 24))) + 1;
  };

  const numberOfDays = calculateDays(form.from, form.to);

  useEffect(() => {
    if (form.leaveType === "CHILD_CARE") {
      if (user?.gender !== "FEMALE") {
        setValidationError(`❌ ${t("childCareOnlyFemale")}`);
      } else if (numberOfDays > 0 && numberOfDays < 180) {
        setValidationError(
          `❌ ${t("childCareMinDays")} ${t("youSelected")}: ${numberOfDays} ${t("days")}.`
        );
      } else {
        setValidationError(null);
      }
    } else {
      setValidationError(null);
    }
  }, [form.leaveType, numberOfDays, user?.gender, t]);

  useEffect(() => {
    if (!editingId) return;
    const leave = leaves.find((l) => l.id === editingId);
    if (!leave) return;
    setForm({
      leaveType: leave.leaveType,
      from: leave.from,
      to: leave.to,
      reason: leave.reason,
    });
    setEditingStatus(leave.status);
  }, [editingId, leaves]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.leaveType) {
      alert(t("pleaseSelectLeaveType"));
      return;
    }

    if (form.leaveType === "CHILD_CARE") {
      if (user?.gender !== "FEMALE") {
        alert(`❌ ${t("childCareOnlyFemale")}`);
        return;
      }
      if (numberOfDays < 180) {
        alert(`❌ ${t("childCareMinDays")}\n\n${t("youSelected")}: ${numberOfDays} ${t("days")}.`);
        return;
      }
    }

    if (editingId) {
      editLeave(editingId, { ...form, status: "PENDING" });
    } else {
      addLeave(
        {
          leaveType: form.leaveType,
          from: form.from,
          to: form.to,
          reason: form.reason,
        },
        "PENDING"
      );
    }

    navigate("/police/leave-status");
  };

  const handleSaveDraft = () => {
    if (!form.leaveType) {
      alert(t("pleaseSelectLeaveType"));
      return;
    }

    if (editingId) {
      editLeave(editingId, { ...form, status: "DRAFT" });
    } else {
      addLeave(
        {
          leaveType: form.leaveType,
          from: form.from,
          to: form.to,
          reason: form.reason,
        },
        "DRAFT"
      );
    }

    navigate("/police/leave-status");
  };

  // Map leave types to translation keys
  const leaveTypeOptions = [
    { value: "CASUAL", labelKey: "casual" },
    { value: "SICK", labelKey: "sick" },
    { value: "EARNED", labelKey: "earned" },
    { value: "EMERGENCY", labelKey: "emergency" },
    { value: "CHILD_CARE", labelKey: "childCare" },
  ];

  return (
    <DashboardLayout>
      <div className="w-full h-full p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 w-full max-w-lg bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="bg-gradient-to-r from-[#1a237e] to-[#303f9f] text-white p-4 rounded-xl -mt-4 -mx-4 sm:-mt-6 sm:-mx-6 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-center">
              {editingId ? t("editLeave") : t("applyLeave")}
            </h2>
          </div>

          <Select
            label={t("selectLeaveType")}
            name="leaveType"
            value={form.leaveType ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                leaveType: e.target.value as LeaveType,
              }))
            }
            required
            className="w-full border px-3 py-2 rounded text-sm sm:text-base"
          >
            <option value="">{t("selectLeaveType")}</option>
            {leaveTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label={t("fromDate")}
              type="date"
              name="from"
              value={form.from}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-sm sm:text-base"
            />

            <InputField
              label={t("toDate")}
              type="date"
              name="to"
              value={form.to}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded text-sm sm:text-base"
            />
          </div>

          {form.from && form.to && (
            <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded">
              📅 {t("totalDays")}: <span className="font-semibold">{numberOfDays} {t("days")}</span>
              {form.leaveType === "CHILD_CARE" && numberOfDays >= 180 && (
                <span className="text-green-600 ml-2">✅ {t("validForChildCare")}</span>
              )}
            </div>
          )}

          {validationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-md text-xs sm:text-sm">
              {validationError}
            </div>
          )}

          <div>
            <label htmlFor="reason" className="block font-medium mb-1 text-sm sm:text-base">
              {t("reason")}
            </label>
            <textarea
              id="reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border px-3 py-2 rounded text-sm sm:text-base resize-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            {(!editingId || editingStatus === "DRAFT") && (
              <button
                type="button"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto bg-gray-200 px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition border border-gray-300"
              >
                {t("saveDraft")}
              </button>
            )}
            <button
              type="submit"
              disabled={!!validationError}
              className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg text-white text-sm font-semibold transition shadow-md ${
                validationError ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#1a237e] to-[#303f9f] hover:shadow-lg"
              }`}
            >
              {editingId ? t("updateLeave") : t("applyLeave")}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ApplyLeave;