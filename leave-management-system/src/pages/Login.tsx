import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../context/UserContext";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { users } = useUsers();

  const [uno, setUno] = useState("");
  const [contact, setContact] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const isFormValid = uno.length > 0 && contact.length === 10;
  const isOtpValid = otpInput.length === 6;

  const handleRequestOtp = () => {
    if (!uno || !contact) {
      alert(t("enterUno") + " & " + t("enterContact"));
      return;
    }

    const matchedUser = users.find(
      (u) => u.uno === uno && u.contact === contact
    );

    if (!matchedUser) {
      alert(t("invalidCredentials"));
      return;
    }

    if (!matchedUser.isActive) {
      alert(t("accountDeactivated"));
      return;
    }

    setShowOtp(true);
    alert(t("otpSentMessage") + " 123456 (demo)");
  };

  const handleVerifyOtp = () => {
    const matchedUser = users.find(
      (u) => u.uno === uno && u.contact === contact
    );

    if (!matchedUser) {
      alert(t("userNotFound"));
      return;
    }

    if (!matchedUser.isActive) {
      alert(t("accountInactive"));
      return;
    }

    if (otpInput !== "123456") {
      alert(t("invalidOtp"));
      return;
    }

    login({
      id: matchedUser.id,
      name: matchedUser.name,
      uno: matchedUser.uno,
      role: matchedUser.role,
      isActive: matchedUser.isActive,
      contact: matchedUser.contact,
      rank: matchedUser.rank,
      circleOffice: matchedUser.circleOffice,
      policeStation: matchedUser.policeStation,
      area: matchedUser.area,
      gender: matchedUser.gender,
      password: matchedUser.password || "",
    });

    // Use setTimeout to ensure state is saved before navigation (mobile fix)
    // Increased delay for mobile browsers
    setTimeout(() => {
      // All POLICE users (including SSP) go to /police
      // DashboardRouter will render the correct dashboard based on rank
      window.location.href = "/police";
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-16">
        <div className="bg-white w-full max-w-sm sm:max-w-md rounded-lg shadow-md border border-gray-200">
          <div className="px-4 sm:px-6 py-4 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{t("police")}</h1>
          </div>

          <div className="px-4 sm:px-6 space-y-4 pb-6">
            {!showOtp ? (
              <>
                <input
                  type="text"
                  placeholder={t("enterUno")}
                  value={uno}
                  onChange={(e) => setUno(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder={t("enterContact")}
                  value={contact}
                  onChange={(e) => setContact(e.target.value.replace(/\D/g, ""))}
                  maxLength={10}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  disabled={!isFormValid}
                  className={`w-full bg-primary text-white py-3 rounded-md text-sm font-medium transition ${
                    isFormValid ? "hover:opacity-90 active:scale-[0.98]" : "opacity-60 cursor-not-allowed"
                  }`}
                  onClick={handleRequestOtp}
                >
                  {t("loginWithOtp")}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 text-center">
                  {t("otpSentTo")} {contact}
                </p>
                <input
                  type="text"
                  placeholder={t("enterOtp")}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 sm:py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  disabled={!isOtpValid}
                  className={`w-full bg-primary text-white py-3 rounded-md text-sm font-medium transition ${
                    isOtpValid ? "hover:opacity-90 active:scale-[0.98]" : "opacity-60 cursor-not-allowed"
                  }`}
                  onClick={handleVerifyOtp}
                >
                  {t("verifyOtp")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="w-full text-sm text-gray-500 hover:text-gray-700"
                >
                  ← {t("backToLogin")}
                </button>
              </>
            )}
          </div>
           <div className="p-4 border-t border-gray-200">
            <span className="text-xs text-gray-500 block mb-1">{t("demoCredentials")}</span>
            <span className="text-xs text-gray-500">UNO: UNO6001, Contact: 9876500008 (CONSTABLE)</span><br />
            <span className="text-xs text-gray-500">UNO: UNO5001, Contact: 9876500007 (HEAD CONSTABLE)</span><br />
            <span className="text-xs text-gray-500">UNO: UNO4001, Contact: 9876500006 (INSPECTOR)</span><br />
            <span className="text-xs text-gray-500">UNO: UNO3001, Contact: 9876500005 (SI)</span><br />
            <span className="text-xs text-gray-500">UNO: UNO2001, Contact: 9876500004 (SHO/SO)</span><br />
            <span className="text-xs text-gray-500">UNO: UNO1001, Contact: 9876500003 (SP)</span><br />
            <span className="text-xs text-gray-500">UNO: UNO0001, Contact: 9876500002 (CO)</span><br />
            <span className="text-xs text-gray-500">UNO: UNO9001, Contact: 9876500001 (ADMIN)(SSP)</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;