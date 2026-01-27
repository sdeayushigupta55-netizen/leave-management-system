import { useState, type ChangeEvent, type FormEvent } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useLeave } from "../context/LeaveContext";
import { useNavigate } from "react-router-dom";

interface FormState {
  type: string;
  from: string;
  to: string;
  reason: string;
}

const ApplyLeave = () => {
  const [form, setForm] = useState<FormState>({
    type: "",
    from: "",
    to: "",
    reason: "",
  });
  const { addLeave } = useLeave();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addLeave({
      leaveType:
        form.type === "sick"
          ? "Sick"
          : form.type === "casual"
          ? "Casual"
          : form.type === "earned"
          ? "Earned"
          : form.type,
      from: form.from
        ? new Date(form.from).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
        : "",
      to: form.to
        ? new Date(form.to).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
        : "",
      reason: form.reason,
    });
    setForm({ type: "", from: "", to: "", reason: "" });
    navigate("/employee/leave-status");
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Apply for Leave</h2>
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
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded font-semibold hover:opacity-90"
          >
            Apply
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ApplyLeave;