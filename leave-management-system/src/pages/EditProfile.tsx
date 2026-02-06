import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import InputField from "../ui/Input";
import Button from "../ui/Button";

const EditProfile = () => {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    contact: user?.contact || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    alert("Profile updated successfully");
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Profile Details */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#e8eaf6] rounded-xl">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1a237e]">Profile Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
            <InputField label="Name" value={user.name} disabled />
            <InputField label="UNO Number" value={user.uno || "-"} disabled />
            <InputField label="Role" value={user.role} disabled />
            <InputField label="Rank" value={user.rank || "-"} disabled />
            <InputField label="Area" value={user.area || "-"} disabled />
            <InputField label="Circle Office" value={user.circleOffice || "-"} disabled />
            <InputField label="Police Station" value={user.policeStation || "-"} disabled />
            <InputField label="Contact" value={user.contact || "-"} disabled />
          </div>
        </div>

        {/* Update Contact */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#fff8e1] rounded-xl">
              <span className="text-2xl">📱</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1a237e]">Update Contact</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <InputField
              name="contact"
              label="Contact Number"
              value={form.contact}
              onChange={handleChange}
              maxLength={10}
              placeholder="Enter 10-digit contact number"
              required
            />

            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditProfile;