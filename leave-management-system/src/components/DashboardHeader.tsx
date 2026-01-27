
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const DashboardHeader = () => {
    const { i18n } = useTranslation();
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between bg-primary px-4 md:px-6 py-3">
      <div className="flex-1">
        {/* <div >
      <img
        src="https://auth.mygov.in/sites/all/themes/mygovauth/logo.png"
        alt="MyGov Auth"
        className="h-10 md:h-12"
      />
    </div> */}
      </div>
     
      <div className="flex-1 flex items-center justify-end gap-4">
        {user && (
          <div className="relative group user_pic">
            <button className="flex items-center gap-2 focus:outline-none">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? "")}&background=fff&color=000`}
                alt="user picture"
                className="w-10 h-10 rounded-full border profile-image"
                height="40"
              />
            </button>
            <div id="edit_profile_menu" className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
              <div className="user-details flex flex-col items-center py-4">
                <span className="image mb-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? "")}&background=fff&color=000`}
                    alt="user picture"
                    className="profile-image w-20 h-20 rounded-full border"
                    height="80"
                  />
                </span>
                <span className="name font-semibold text-gray-800 text-base mb-1">{user.name}</span>
                <span className="upload-picture-link text-xs text-primary underline mb-2">
                  <a href="#">Update Picture</a>
                </span>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 border-t">Edit Profile</button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700">Logout</button>
            </div>
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
    </header>
  );
};

export default DashboardHeader;
