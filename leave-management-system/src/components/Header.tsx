import { useTranslation } from "react-i18next";

const Header = () => {
  const { i18n } = useTranslation();
  
  return (
    <header className="flex items-center justify-between bg-[#1a237e] px-3 sm:px-4 md:px-6 py-2 sm:py-3 border-b-2 border-[#c5a200]">
      <div className="flex-1" />
      
      {/* Logo - Centered */}
      <div className="flex-1 flex justify-center">
        <img
          src="https://auth.mygov.in/sites/all/themes/mygovauth/logo.png"
          alt="MyGov Auth"
          className="h-8 sm:h-10 md:h-12"
        />
      </div>
      
      {/* Language Selector */}
      <div className="flex-1 flex justify-end">
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="rounded px-2 py-1 text-xs sm:text-sm border border-[#c5a200] bg-white text-[#1a237e] font-medium"
        >
          <option value="en">EN</option>
          <option value="hi">हि</option>
        </select>
      </div>
    </header>
  );
};

export default Header;