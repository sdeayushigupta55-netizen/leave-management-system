import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          police: "Uttar Pradesh Police",
          loginWithOtp: "Log In with OTP",
          emailMobileOtp: "Log In With OTP",
          or: "or",
          emailMobile: "E-mail/Mobile",
          password: "Password",
          forgotPassword: "Forgot your password?",
          loginWithPassword: "Log In With Password",
          dashboard: "Dashboard",
          applyLeave: "Apply Leave",
          myLeaveStatus: "My Leave Status",
          approveLeaves: "Approve Leaves",
          allReports: "All Reports",
          policeLeaveSystem: "Police Leave System",
          govtOfUp: "Government of Uttar Pradesh",
          employeeDashboard: "Employee Dashboard",
          welcome: "Welcome",
          totalLeaves: "Total Leaves",
          usedLeaves: "Used Leaves",
          pendingRequests: "Pending Requests",
          contact: "Contact",
          enterContact: "Enter your contact number",
          enterOtp: "Enter the OTP sent to your contact",
          sendOtp: "Send OTP",
          verifyOtp: "Verify OTP",
          invalidContact: "Please enter a valid contact number.",
          invalidOtp: "Please enter a valid OTP.",
          otpSentMessage: "OTP has been sent to your contact.",
          // ...other keys
        }
      },
      hi: {
        translation: {
          police: "उत्तर प्रदेश पुलिस",
          loginWithOtp: "ओटीपी से लॉगिन करें",
          emailMobileOtp: "ओटीपी से लॉगिन करें",
          or: "या",
          emailMobile: "ई-मेल/मोबाइल",
          password: "पासवर्ड",
          forgotPassword: "पासवर्ड भूल गए?",
          loginWithPassword: "पासवर्ड से लॉगिन करें",
          dashboard: "डैशबोर्ड",
          applyLeave: "अवकाश के लिए आवेदन करें",
          myLeaveStatus: "मेरे अवकाश की स्थिति",
          approveLeaves: "अवकाश स्वीकृत करें",
          allReports: "सभी रिपोर्ट्स",
          policeLeaveSystem: "पुलिस अवकाश प्रणाली",
          govtOfUp: "उत्तर प्रदेश सरकार",
          employeeDashboard: "कर्मचारी डैशबोर्ड",
          welcome: "स्वागत है",
          totalLeaves: "कुल अवकाश",
          usedLeaves: "प्रयुक्त अवकाश",
          pendingRequests: "लंबित अनुरोध",
          contact: "संपर्क",
          enterContact: "अपना संपर्क नंबर दर्ज करें",
          enterOtp: "अपने संपर्क पर भेजा गया ओटीपी दर्ज करें",
          sendOtp: "ओटीपी भेजें",
          verifyOtp: "ओटीपी सत्यापित करें",
          invalidContact: "कृपया एक मान्य संपर्क नंबर दर्ज करें।",
          invalidOtp: "कृपया एक मान्य ओटीपी दर्ज करें।",
          otpSentMessage: "ओटीपी आपके संपर्क पर भेजा गया है।",
        }
      }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;