import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useLeave } from "../context/LeaveContext";
import { useNavigate, useLocation } from "react-router-dom";
import type { LeaveType } from "../type/leave";
import  Select from "../ui/Select";
import InputField  from "../ui/Input";


interface FormState {
  leaveType?: LeaveType;
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
    leaveType: undefined,
    from: "",
    to: "",
    reason: "",
  });

  const [editingStatus, setEditingStatus] = useState<string | null>(null);

  // Prefill when editing
  useEffect(() => {
    if (!editingId) return;

    const leave = leaves.find(l => l.id === editingId);
    if (!leave) return;

    setForm({
      leaveType: leave.leaveType,
      from: leave.from,
      to: leave.to,
      reason: leave.reason,
    });

    setEditingStatus(leave.status);
  }, [editingId, leaves]);

  // For inputs & textarea only
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Apply / Update
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.leaveType) {
      alert("Please select leave type");
      return;
    }

    if (editingId) {
      editLeave(editingId, {
        ...form,
        status: "PENDING",
      });
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

  // Save Draft
  const handleSaveDraft = () => {
    if (!form.leaveType) {
      alert("Please select leave type");
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

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-gray-50 p-2 sm:p-6">
 <form onSubmit={handleSubmit} className="space-y-4">
           <h2 className="text-xl font-bold">
          {editingId ? "Edit Leave" : "Apply Leave"}
        </h2>
          {/* Leave Type */}
          <Select
          label="Select Leave Type"
            name="leaveType"
            value={form.leaveType ?? ""}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                leaveType: e.target.value as LeaveType,
              }))
            }
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Leave Type</option>
            <option value="CASUAL">Casual</option>
            <option value="SICK">Sick</option>
            <option value="EARNED">Earned</option>
            <option value="EMERGENCY">Emergency</option>
          </Select>

          <InputField
          label="From Date"
            type="date"
            name="from"
            value={form.from}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <InputField
          label="To Date"
            type="date"
            name="to"
            value={form.to}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <label htmlFor="reason" className="block font-medium">
            Reason
          </label>
          <textarea
            id="reason"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-3">
            {(!editingId || editingStatus === "DRAFT") && (
              <button
                type="button"
                onClick={handleSaveDraft}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Save Draft
              </button>
            )}

            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded"
            >
              {editingId ? "Update" : "Apply"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ApplyLeave;
