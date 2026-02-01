import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { users } = useUsers();

  // ====== STATE ======
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState(""); // for OTP login
  const [otpInput, setOtpInput] = useState("");
  const [showOtp, setShowOtp] = useState(false);


    const isContactValid = contact.length === 9;
  const isOtpValid = otpInput.length === 6;
  // ====== PASSWORD LOGIN ======
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const matchedUser = users.find(
      u => u.email === email && u.password === password
    );

    if (!matchedUser) {
      alert("Invalid email or password");
      return;
    }

    if (!matchedUser.isActive) {
      alert("Your account is deactivated. Contact admin.");
      return;
    }

    login({
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      isActive: matchedUser.isActive,
      contact: matchedUser.contact,
      rank: matchedUser.rank,
      policeStation: matchedUser.policeStation,
       password: matchedUser.password || "",
    });

    navigate(matchedUser.role === "ADMIN" ? "/admin" : "/police");
  };

  // ====== OTP LOGIN ======
  const handleRequestOtp = () => {
    if (!contact) {
      alert("Enter your contact number");
      return;
    }

    const userExists = users.find(u => u.contact === contact);
    if (!userExists) {
      alert("User not found");
      return;
    }

    setShowOtp(true);
    alert("OTP sent: 123456 (demo only)"); // 🔴 demo OTP
  };

  const handleVerifyOtp = () => {
    const user = users.find(u => u.contact === contact);
    if (!user) return alert("User not found");

    if (!user.isActive) return alert("Account inactive");

    if (otpInput !== "123456") return alert("Invalid OTP");

    login({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      contact: user.contact,
      rank: user.rank,
      policeStation: user.policeStation,
    password: user.password || "",
    });

    navigate(user.role === "ADMIN" ? "/admin" : "/police");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-2 md:px-4">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="relative bg-white w-full max-w-xs md:max-w-md rounded-lg shadow-md border border-gray-200 mt-24 mb-20">
        {/* Title */}
        <div className="px-4 md:px-6 py-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">{t("police")}</h1>
        </div>

          {/* ================= OTP Section ================= */}
        <div className="px-4 md:px-6 space-y-4">
          {!showOtp ? (
            <>
              <input
                type="text"
                placeholder={t("enterContact")}
                value={contact}
                onChange={e => setContact(e.target.value.replace(/\D/g, ""))}
                maxLength={9}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={!isContactValid}
                className={`w-full bg-primary text-white py-3 rounded-md text-sm font-medium ${
                  isContactValid ? "hover:opacity-90" : "opacity-60 cursor-not-allowed"
                }`}
                onClick={handleRequestOtp}
              >
                {t("loginWithOtp")}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder={t("enterOtp")}
                value={otpInput}
                onChange={e =>
                  setOtpInput(e.target.value.replace(/\D/g, ""))
                }
                maxLength={6}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={!isOtpValid}
                className={`w-full bg-primary text-white py-3 rounded-md text-sm font-medium ${
                  isOtpValid ? "hover:opacity-90" : "opacity-60 cursor-not-allowed"
                }`}
                onClick={handleVerifyOtp}
              >
                {t("verifyOtp")}
              </button>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center my-6 px-4 md:px-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 bg-gray-100 border rounded-full px-4 py-1 text-xs">
            {t("or")}
          </span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Password Login */}
        <form onSubmit={handleLogin} className="px-4 md:px-6 space-y-4 pb-6">
          <input
            type="email"
            placeholder={t("emailMobile")}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />

          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-md text-sm font-medium hover:opacity-90"
          >
            {t("loginWithPassword")}
          </button>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
