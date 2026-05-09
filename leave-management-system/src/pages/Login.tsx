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

  const [pno, setPno] = useState("");
  const [contact, setContact] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const isFormValid = pno.length > 0 && contact.length === 10;
  const isOtpValid = otpInput.length === 6;

  const handleRequestOtp = () => {
    if (!pno || !contact) {
      alert(t("enterPno") + " & " + t("enterContact"));
      return;
    }

    const matchedUser = users.find(
      (u) => u.pno === pno && u.contact === contact
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
      (u) => u.pno === pno && u.contact === contact
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
      beatId: matchedUser.beatId || "",
      id: matchedUser.id,
      name: matchedUser.name,
      pno: matchedUser.pno,
      role: matchedUser.role,
      isActive: matchedUser.isActive,
      contact: matchedUser.contact,
      rank: matchedUser.rank,
      circleOffice: matchedUser.circleOffice,
      policeStation: matchedUser.policeStation,
      area: matchedUser.area,
      gender: matchedUser.gender === "Male" || matchedUser.gender === "Female" ? matchedUser.gender : undefined,
      password: matchedUser.password || "",
      profilPic: matchedUser.profilPic,
      createdAt: matchedUser.createdAt,
      _id: undefined
    });

    // Use setTimeout to ensure state is saved before navigation (mobile fix)
    // Increased delay for mobile browsers
    setTimeout(() => {
  if (matchedUser.role === "ADMIN") {
    window.location.href = "/admin";
  } else {
    window.location.href = "/police";
  }
}, 150);
  };

 
  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
  
      {/* ===== Background ===== */}
      <div className="absolute inset-0">
        <img
          src="/policebg.png"
          alt="bg"
          className="w-full h-full object-cover"
        />
  
        <div className="absolute inset-0  backdrop-blur-sm"></div>
      </div>
  
      {/* Header */}
      <div className="fixed top-0 w-full z-50">
        <Header />
      </div>
  
      {/* ===== Center Card ===== */}
      <div className="flex-1 flex justify-center items-center px-4 pt-24 relative z-10">
  
        <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden bg-white/90 backdrop-blur-xl">
  
          {/* Top Badge */}
          <div className="bg-blue-950 text-center py-8 relative badge-wrapper">
  
            <img
              src="/police-badge.png"
              alt="badge"
              className="police-badge"
            />
  
          </div>
          
  
          {/* Content */}
          <div className="px-8 pt-14 pb-8">
  
            <h1 className="text-2xl font-bold text-center text-blue-900">
              POLICE LEAVE SYSTEM
            </h1>
  
            <p className="text-center text-gray-600 mb-6">
              Secure Login Portal
            </p>
  
            {!showOtp ? (
              <>
                {/* PNO */}
                <div className="relative mb-4">
                  <span className="absolute left-4 top-3 text-gray-400">
                    👤
                  </span>
  
                  <input
                    type="text"
                    placeholder={t("enterPno")}
                    value={pno}
                    onChange={(e) => setPno(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
  
                {/* Contact */}
                <div className="relative mb-6">
                  <span className="absolute left-4 top-3 text-gray-400">
                    📱
                  </span>
  
                  <input
                    type="text"
                    placeholder={t("enterContact")}
                    value={contact}
                    onChange={(e) =>
                      setContact(e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
  
                {/* Login Button */}
                <button
                  disabled={!isFormValid}
                  onClick={handleRequestOtp}
                  className={`w-full py-3 rounded-lg font-semibold transition shadow-lg
                  ${
                    isFormValid
                      ? "bg-blue-900 hover:bg-blue-800 text-white"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                >
                  🚀 {t("loginWithOtp")}
                </button>
              </>
            ) : (
              <>
                <p className="text-center text-gray-600 mb-3">
                  {t("otpSentTo")} {contact}
                </p>
  
                <input
                  type="text"
                  placeholder={t("enterOtp")}
                  value={otpInput}
                  onChange={(e) =>
                    setOtpInput(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={6}
                  className="w-full text-center tracking-widest py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none mb-4"
                />
  
                <button
                  disabled={!isOtpValid}
                  onClick={handleVerifyOtp}
                  className={`w-full py-3 rounded-lg font-semibold
                  ${
                    isOtpValid
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                >
                  ✅ {t("verifyOtp")}
                </button>
  
                <button
                  onClick={() => setShowOtp(false)}
                  className="w-full mt-3 text-sm text-gray-600 hover:text-blue-700"
                >
                  ← {t("backToLogin")}
                </button>
              </>
            )}
  
            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-[1px] bg-gray-300"></div>
              <span className="px-3 text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-[1px] bg-gray-300"></div>
            </div>
  
            <p className="text-center text-sm text-gray-600">
              🔒 Secure • Reliable • Trusted
            </p>
  
          </div>
  
          {/* Bottom */}
          <div className="bg-blue-950 text-white text-center text-sm py-3">
            🔐 Your security is our priority
          </div>
  
        </div>
      </div>
  
      <Footer />
    </div>
  )};

export default Login;