import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropdownOpen(false);
    }
  };

  return (
    <header className="flex items-center bg-primary px-4 md:px-6 py-3">
      <button className="flex items-center gap-2"  >
        {/* <PanelRightOpen size={24} color="white" /> */}
        <h1 className="text-lg font-semibold text-white px-8 mb-2">Dashboard</h1>
      </button>
      <div className="flex-1 flex items-center justify-end gap-4">
        {user && (
          <div className="relative user_pic">
            <button
              className="flex items-center gap-2 focus:outline-none text-white"
              onClick={() => setDropdownOpen((open) => !open)}
              tabIndex={0}
              onBlur={handleBlur}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? "")}&background=fff&color=000`}
                alt="user picture"
                className="w-10 h-10 rounded-full border profile-image"
                height="40"
              />
            </button>
            {dropdownOpen && (
              <div
                id="edit_profile_menu"
                className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg border border-gray-200 z-50"
              >

                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 border-t"
                  onMouseDown={() => navigate("/police/edit-profile")}
                >Edit Profile</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700" onMouseDown={() => navigate("/logout")}>Logout</button>
              </div>
            )}
          </div>
        )}
        <select
          value={i18n.language}
          onChange={e => i18n.changeLanguage(e.target.value)}
          className="ml-2 rounded px-2 py-1 text-sm border border-gray-300"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>
      {/* Overlay for mobile */}
      {/* {open && (
        <div
          className="fixed inset-0 z-20 bg-black"
          onClick={() => setOpen(false)}
        />
      )} */}
    </header>
  );
};

export default DashboardHeader;