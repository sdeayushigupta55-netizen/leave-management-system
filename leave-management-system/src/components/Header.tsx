
import { useTranslation } from "react-i18next";
const Header = () => {
    const { i18n } = useTranslation();
  return (
  <header className="flex items-center justify-between bg-primary px-4 md:px-6 py-3">

    <div className="flex-1" />
    <div className="flex-1 flex justify-center">
      <img
        src="https://auth.mygov.in/sites/all/themes/mygovauth/logo.png"
        alt="MyGov Auth"
        className="h-10 md:h-12"
      />
    </div>
    <div className="flex-1 flex justify-end">
     <select
        value={i18n.language}
        onChange={e => i18n.changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>
    </div>
  </header>
);
}

export default Header;