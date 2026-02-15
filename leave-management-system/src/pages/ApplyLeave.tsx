import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useLeaves } from "../context/LeaveContext";
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
  attachment?: File | null;
}

const ApplyLeave = () => {
  const { t } = useTranslation();
  const { leaves, addLeave, editLeave } = useLeaves();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editingId = location.state?.leaveId;

  const [form, setForm] = useState<FormState>({
    leaveType: undefined,
    from: "",
    to: "",
    reason: "",
    attachment: null,
  });

  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
      if (user?.gender !== "Female") {
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setForm((prev) => ({ ...prev, attachment: file }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.leaveType) {
      alert(t("pleaseSelectLeaveType"));
      return;
    }

    if (form.leaveType === "CHILD_CARE") {
      if (user?.gender !== "Female") {
        alert(`❌ ${t("childCareOnlyFemale")}`);
        return;
      }
      if (numberOfDays < 180) {
        alert(`❌ ${t("childCareMinDays")}\n\n${t("youSelected")}: ${numberOfDays} ${t("days")}.`);
        return;
      }
    }

    let attachmentUrl: string | undefined = undefined;
    if (form.attachment instanceof File) {
      attachmentUrl = URL.createObjectURL(form.attachment);
    } else if (typeof form.attachment === 'string') {
      attachmentUrl = form.attachment;
    }
    if (editingId) {
      editLeave(editingId, { ...form, status: "PENDING", attachment: attachmentUrl });
    } else {
      addLeave(
        {
          leaveType: form.leaveType,
          from: form.from,
          to: form.to,
          reason: form.reason,
          attachment: attachmentUrl,
        },
        "PENDING"
      );
    }

    setSuccessMessage(t("leaveAppliedSuccessfully") || "Leave applied successfully!");
    setShowSuccessModal(true);
  };

  const handleSaveDraft = () => {
    if (!form.leaveType) {
      alert(t("pleaseSelectLeaveType"));
      return;
    }
    let attachmentUrl: string | undefined = undefined;
    if (form.attachment instanceof File) {
      attachmentUrl = URL.createObjectURL(form.attachment);
    } else if (typeof form.attachment === 'string') {
      attachmentUrl = form.attachment;
    }
    if (editingId) {
      editLeave(editingId, { ...form, status: "DRAFT", attachment: attachmentUrl });
    } else {
      addLeave(
        {
          leaveType: form.leaveType,
          from: form.from,
          to: form.to,
          reason: form.reason,
          attachment: attachmentUrl,
        },
        "DRAFT"
      );
    }
    navigate("/police/leave-status");
  };

  // Restore the missing return statement and form JSX
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
            <option value="CASUAL">{t("casual")}</option>
            <option value="SICK">{t("sick")}</option>
            <option value="EARNED">{t("earned")}</option>
            <option value="EMERGENCY">{t("emergency")}</option>
            <option value="CHILD_CARE">{t("childCare")}</option>
            <option value="MEDICAL">{t("medical")}</option>
            <option value="PATERNITY">{t("paternity")}</option>
            <option value="MATERNITY">{t("maternity")}</option>
            <option value="OPTIONAL">{t("optional")}</option>
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
              📅 {t("totalDays")}: <span className="font-semibold">{calculateDays(form.from, form.to)} {t("days")}</span>
              {form.leaveType === "CHILD_CARE" && calculateDays(form.from, form.to) >= 180 && (
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

          <div>
            <label htmlFor="attachment" className="block font-medium mb-1 text-sm sm:text-base">
              {t("uploadApplication")}
            </label>
            <input
              id="attachment"
              name="attachment"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              className="w-full border px-3 py-2 rounded text-sm sm:text-base bg-white"
              required
            />
            {form.attachment && (
              <div className="text-xs text-gray-600 mt-1">
                {t("selectedFile")}: {form.attachment.name}
              </div>
            )}
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
              {editingId ? t("updateLeave") : t("Submit")}
            </button>
          </div>
        </form>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col gap-3 items-center">
              <h3 className="font-semibold text-lg mb-2 text-green-700">{successMessage}</h3>
              <button
                onClick={() => { setShowSuccessModal(false); navigate("/police/leave-status"); }}
                className="px-4 py-2 rounded bg-[#138808] hover:bg-[#0d6b06] text-white font-semibold mt-2"
              >
                {t("ok") || "OK"}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplyLeave;