import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropdownOpen(false);
    }
  };

  return (
    <header className="flex items-center bg-[#1a237e] px-3 sm:px-4 md:px-6 py-2 sm:py-3 border-b-2 border-[#c5a200]">
      <div className="hidden sm:block">
        <h1 className="text-base sm:text-lg font-semibold text-white ml-8 md:ml-0">
          {t("dashboard")}
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
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
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border profile-image"
              />
              <span className="hidden md:block text-sm">{user.name}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white rounded shadow-lg border border-gray-200 z-50">
                <button
                  className="w-full text-left px-3 sm:px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                  onMouseDown={() => navigate("/police/edit-profile")}
                >
                  {t("editProfile")}
                </button>
                <button
                  className="w-full text-left px-3 sm:px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 border-t"
                  onMouseDown={() => navigate("/logout")}
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        )}

        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-xs sm:text-sm border-2 border-[#c5a200] bg-white text-[#1a237e] font-semibold cursor-pointer hover:bg-[#fffde7] transition-colors"
        >
          <option value="en">EN</option>
          <option value="hi">हि</option>
        </select>
      </div>
    </header>
  );
};

export default DashboardHeader;