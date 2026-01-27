import  { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../constants/roles";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = (e: { preventDefault: () => void; }) => {
  e.preventDefault();

  let user = null;

  // 🔐 DEMO USERS (Frontend Only)
  if (email === "employee@police.gov.in" && password === "Police@123") {
    user = { name: "Junior Employee", role: ROLES.JUNIOR };
    login(user);
    navigate("/employee");
  } 
  else if (email === "sho@police.gov.in" && password === "Police@123") {
    user = { name: "Senior Officer (SHO)", role: ROLES.SENIOR };
    login(user);
    navigate("/senior");
  } 
  else if (email === "hod@police.gov.in" && password === "Police@123") {
    user = { name: "Head of Department", role: ROLES.HOD };
    login(user);
    navigate("/hod");
  }
  else if (email === "admin@police.gov.in" && password === "Police@123") {
    user = { name: "Admin User", role: ROLES.ADMIN };
    login(user);
    navigate("/admin");
  } 
  else {
    alert("Invalid credentials");
  }
};


  const [otpInput, setOtpInput] = useState("");
  const isOtpValid = /^\d{9}$/.test(otpInput);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-2 md:px-4">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Login Card */}
      <div className="relative bg-white w-full max-w-xs md:max-w-md rounded-lg shadow-md border border-gray-200 mt-24 mb-20">
        {/* Title */}
        <div className="px-4 md:px-6 py-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {t("police")}
          </h1>
        </div>

        {/* OTP Section (UI Only) */}
        <div className="px-4 md:px-6 space-y-4">
          <input
            type="text"
            placeholder={t("emailMobileOtp")}
            value={otpInput}
            onChange={e => setOtpInput(e.target.value.replace(/\D/g, ""))}
            maxLength={9}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={!isOtpValid}
            className={`w-full bg-primary text-white py-3 rounded-md text-sm font-medium ${isOtpValid ? "hover:opacity-90" : "opacity-60 cursor-not-allowed"}`}
          >
            {t("loginWithOtp")}
          </button>
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
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />

          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />

          <div className="flex justify-end">
            <span className="text-primary text-xs cursor-pointer hover:underline">
              {t("forgotPassword")}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-md text-sm font-medium hover:opacity-90"
          >
            {t("loginWithPassword")}
          </button>

          {/* Demo Help */}
          <div className="text-xs text-gray-600 pt-2">
            <p><b>Demo Accounts:</b></p>
            <p>employee@police.gov.in</p>
            <p>sho@police.gov.in</p>
            <p>admin@police.gov.in</p>
            <p>Password: Police@123</p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
