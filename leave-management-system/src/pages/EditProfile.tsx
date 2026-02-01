import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import InputField from "../ui/Input";
import Button from "../ui/Button";

const EditProfile = () => {
  const { user, updateProfile, changePassword } = useAuth();

  const [form, setForm] = useState({
    contact: user?.contact || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    alert("Profile updated successfully");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const success = changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    if (!success) {
      setPasswordError("Current password is incorrect");
      return;
    }

    setPasswordSuccess("Password updated successfully");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded shadow space-y-8">

        {/* ================= PROFILE ================= */}
        <div>
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

          <div className="gap-4 grid grid-cols-2 mb-4 text-sm">
            <InputField label="Name" value={user.name} disabled />
            <InputField label="Rank" value={user.rank} disabled />
            <InputField label="Police Station" value={user.policeStation} disabled />
            <InputField label="Email" value={user.email} disabled />
             <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              name="contact"
              label="Contact Number"
              value={form.contact}
              onChange={handleChange}
              maxLength={10}
              required
            />

            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </form>
          </div>

         
        </div>

        {/* ================= SECURITY ================= */}
         <div className="grid grid-cols-2 gap-4 mb-4 text-sm space-y-4">
         <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">🔐 Security</h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <InputField
              type="password"
              name="currentPassword"
              label="Current Password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />

            <InputField
              type="password"
              name="newPassword"
              label="New Password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
            />

            <InputField
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
            />

            {passwordError && (
              <p className="text-red-600 text-sm">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-green-600 text-sm">{passwordSuccess}</p>
            )}

            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </form>
        </div>
        </div>
        </div>
    </DashboardLayout>
  );
};

export default EditProfile;
