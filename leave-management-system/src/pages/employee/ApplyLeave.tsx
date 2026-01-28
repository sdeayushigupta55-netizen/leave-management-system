import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useLeave } from "../../context/LeaveContext";
import { useNavigate, useLocation } from "react-router-dom";

interface FormState {
  type: string;
  from: string;
  to: string;
  reason: string;
}

const ApplyLeave = () => {
  const { leaves, addLeave, editLeave } = useLeave();
  const navigate = useNavigate();
  const location = useLocation();
  const editingId = location.state?.leaveId;

  const [form, setForm] = useState<FormState>({
    type: "",
    from: "",
    to: "",
    reason: "",
  });

  const [editingStatus, setEditingStatus] = useState<"DRAFT" | "REJECTED" | "PENDING" | null>(null);

  // Prefill form if editing
  useEffect(() => {
    if (editingId) {
      const leave = leaves.find((l) => l.id === editingId);
      if (leave) {
        setForm({
          type: leave.leaveType.toLowerCase(),
          from: leave.from
            ? new Date(leave.from).toISOString().split("T")[0]
            : "",
          to: leave.to
            ? new Date(leave.to).toISOString().split("T")[0]
            : "",
          reason: leave.reason,
        });
        setEditingStatus(leave.status as "DRAFT" | "REJECTED" | "PENDING");
      }
    }
  }, [editingId, leaves]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Prepare leave object
  const prepareLeaveData = () => ({
    leaveType:
      form.type === "sick"
        ? "Sick"
        : form.type === "casual"
        ? "Casual"
        : form.type === "earned"
        ? "Earned"
        : form.type,
    from: form.from
      ? new Date(form.from).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })
      : "",
    to: form.to
      ? new Date(form.to).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })
      : "",
    reason: form.reason,
  });

  // Main submit (Apply / Update)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const leaveData = prepareLeaveData();

    if (editingId) {
      // If editing DRAFT or REJECTED, submit as PENDING
      editLeave(editingId, { ...leaveData, status: "PENDING" });
    } else {
      addLeave(leaveData, "PENDING");
    }

    navigate("/employee/leave-status");
  };

  // Save as Draft
  const handleSaveDraft = () => {
    const leaveData = prepareLeaveData();
    if (editingId) {
      editLeave(editingId, { ...leaveData, status: "DRAFT" });
    } else {
      addLeave(leaveData, "DRAFT");
    }
    navigate("/employee/leave-status");
  };

  const showDraftButton = !editingId || editingStatus === "DRAFT";
  const mainButtonText =
    editingStatus === "REJECTED" ? "Update" : editingId ? "Update" : "Apply";

  return (
    <DashboardLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Edit Leave" : "Apply for Leave"}
        </h2>

        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Leave Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select type</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="earned">Earned Leave</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">From Date</label>
              <input
                type="date"
                name="from"
                value={form.from}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">To Date</label>
              <input
                type="date"
                name="to"
                value={form.to}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Reason</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            {showDraftButton && (
              <button
                type="button"
                onClick={handleSaveDraft}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded font-semibold hover:bg-gray-400"
              >
                Save as Draft
              </button>
            )}

            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded font-semibold hover:opacity-90"
            >
              {mainButtonText}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ApplyLeave;
