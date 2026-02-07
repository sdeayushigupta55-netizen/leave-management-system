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
          // ===== GENERAL =====
          police: "Uttar Pradesh Police",
          policeLeaveSystem: "Police Leave System",
          govtOfUp: "Government of Uttar Pradesh",
          
          // ===== LOGIN =====
          loginWithOtp: "Log In with OTP",
          emailMobileOtp: "Log In With OTP",
          or: "or",
          unoNumber: "UNO Number",
          enterUno: "Enter Your UNO Number",
          password: "Password",
          forgotPassword: "Forgot your password?",
          loginWithPassword: "Log In With Password",
          contact: "Contact",
          enterContact: "Enter your contact number",
          enterOtp: "Enter OTP",
          otpSentTo: "OTP sent to",
          sendOtp: "Send OTP",
          verifyOtp: "Verify OTP",
          backToLogin: "Back to login",
          invalidContact: "Please enter a valid contact number.",
          invalidOtp: "Please enter a valid OTP.",
          otpSentMessage: "OTP has been sent to your contact.",
          invalidCredentials: "Invalid UNO or contact number",
          accountDeactivated: "Your account is deactivated. Contact admin.",
          userNotFound: "User not found",
          accountInactive: "Account inactive",
          
          // ===== SIDEBAR / NAVIGATION =====
          dashboard: "Dashboard",
          applyLeave: "Apply Leave",
          myLeaveStatus: "My Leave Status",
          seniorDetails: "Senior Details",
          pendingApprovals: "Pending Approvals",
          reports: "Reports",
          allUsers: "All Users",
          editProfile: "Edit Profile",
          logout: "Logout",
          
          // ===== DASHBOARD =====
          welcome: "Welcome",
          employeeDashboard: "Employee Dashboard",
          myLeaveOverview: "My Leave Overview",
          leaveApprovalOverview: "Leave Approval Overview",
          recentLeaveRequests: "Recent Leave Requests",
          noLeaveRecords: "No leave records found.",
          quickActions: "Quick Actions",
          viewLeaveStatus: "View Leave Status",
          
          // ===== STATS =====
          pending: "Pending",
          approved: "Approved",
          rejected: "Rejected",
          draft: "Draft",
          active: "Active",
          inactive: "Inactive",
          totalLeaves: "Total Leaves",
          usedLeaves: "Used Leaves",
          pendingRequests: "Pending Requests",
          
          // ===== APPLY LEAVE =====
          editLeave: "Edit Leave",
          selectLeaveType: "Select Leave Type",
          leaveType: "Leave Type",
          fromDate: "From Date",
          toDate: "To Date",
          reason: "Reason",
          totalDays: "Total Days",
          days: "days",
          validForChildCare: "Valid for Child Care Leave",
          saveDraft: "Save Draft",
          updateLeave: "Update Leave",
          pleaseSelectLeaveType: "Please select leave type",
          
          // ===== LEAVE TYPES =====
          casual: "Casual",
          sick: "Sick",
          earned: "Earned",
          emergency: "Emergency",
          childCare: "Child Care",
          
          // ===== LEAVE STATUS =====
          leaveStatus: "Leave Status",
          employee: "Employee",
          dates: "Dates",
          numberOfDays: "Number of Days",
          submittedOn: "Submitted On",
          assignedTo: "Assigned To",
          status: "Status",
          actions: "Actions",
          rejectionReason: "Rejection Reason",
          reasonNotProvided: "Reason not provided",
          noLeaveRequests: "No leave requests found",
          showingResults: "Showing",
          of: "of",
          prev: "Prev",
          next: "Next",
          allStatus: "All Status",
          
          // ===== PENDING LEAVE =====
          pendingLeaves: "Pending Leaves",
          noPendingLeaves: "No pending leaves assigned to you.",
          approve: "Approve",
          reject: "Reject",
          forward: "Forward",
          
          // ===== EDIT PROFILE =====
          profileDetails: "Profile Details",
          updateContact: "Update Contact",
          name: "Name",
          role: "Role",
          rank: "Rank",
          area: "Area",
          circleOffice: "Circle Office",
          policeStation: "Police Station",
          contactNumber: "Contact Number",
          enterContactNumber: "Enter 10-digit contact number",
          saveChanges: "Save Changes",
          profileUpdated: "Profile updated successfully",
          
          // ===== SENIOR DETAILS =====
          seniorOfficers: "Senior Officers",
          
          // ===== ADMIN / USERS =====
          users: "Users",
          addUser: "Add User",
          allRoles: "All Roles",
          allRanks: "All Ranks",
          email: "Email",
          edit: "Edit",
          
          // ===== RANKS =====
          constable: "Constable",
          headConstable: "Head Constable",
          si: "SI",
          inspector: "Inspector",
          shoSo: "SHO/SO",
          co: "CO",
          sp: "SP",
          ssp: "SSP",
          
          // ===== VALIDATION =====
          childCareOnlyFemale: "Child Care Leave is only available for female employees.",
          childCareMinDays: "Child Care Leave must be at least 6 months (180 days).",
          youSelected: "You selected",
          
          // ===== SUBTITLES/DESCRIPTIONS =====
          manageAllPersonnel: "Manage all police personnel",
          activePersonnelDesc: "Currently active personnel",
          inactivePersonnelDesc: "Currently inactive personnel",
          latestLeaveApplications: "Latest 5 leave applications",
          reviewPendingRequests: "Review and take action on pending requests",
          trackLeaveApplications: "View and track your leave applications",
          yourLeaveStats: "Your leave application statistics",
          requestsPendingApproval: "Requests pending your approval",
          yourLatestApplications: "Your latest leave applications",
          
          // ===== ADMIN DASHBOARD =====
          sspDashboard: "SSP Dashboard",
          welcomeBack: "Welcome back",
          leaveOverview: "Leave Overview",
          systemLeaveStats: "System-wide leave statistics",
          totalLeavesApplied: "Total Leaves Applied",
          pendingApproval: "Pending Approval",
          approvedLeaves: "Approved Leaves",
          rejectedLeaves: "Rejected Leaves",
          forwardedLeaves: "Forwarded Leaves",
          usersOverview: "Users Overview",
          activeUsers: "Active Users",
          inactiveUsers: "Inactive Users",
          
          // ===== MISC =====
          noDataFound: "No data found",
          loading: "Loading...",
          error: "Error",
          success: "Success",
          cancel: "Cancel",
          confirm: "Confirm",
          yes: "Yes",
          no: "No",
          search: "Search",
          filter: "Filter",
          clear: "Clear",
          close: "Close",
          openSidebar: "Open sidebar",
          closeSidebar: "Close sidebar",
        }
      },
      hi: {
        translation: {
          // ===== GENERAL =====
          police: "उत्तर प्रदेश पुलिस",
          policeLeaveSystem: "पुलिस अवकाश प्रणाली",
          govtOfUp: "उत्तर प्रदेश सरकार",
          
          // ===== LOGIN =====
          loginWithOtp: "ओटीपी से लॉगिन करें",
          emailMobileOtp: "ओटीपी से लॉगिन करें",
          or: "या",
          unoNumber: "यूएनओ नंबर",
          enterUno: "अपना यूएनओ नंबर दर्ज करें",
          password: "पासवर्ड",
          forgotPassword: "पासवर्ड भूल गए?",
          loginWithPassword: "पासवर्ड से लॉगिन करें",
          contact: "संपर्क",
          enterContact: "अपना संपर्क नंबर दर्ज करें",
          enterOtp: "ओटीपी दर्ज करें",
          otpSentTo: "ओटीपी भेजा गया",
          sendOtp: "ओटीपी भेजें",
          verifyOtp: "ओटीपी सत्यापित करें",
          backToLogin: "लॉगिन पर वापस जाएं",
          invalidContact: "कृपया एक मान्य संपर्क नंबर दर्ज करें।",
          invalidOtp: "कृपया एक मान्य ओटीपी दर्ज करें।",
          otpSentMessage: "ओटीपी आपके संपर्क पर भेजा गया है।",
          invalidCredentials: "अमान्य यूएनओ या संपर्क नंबर",
          accountDeactivated: "आपका खाता निष्क्रिय है। व्यवस्थापक से संपर्क करें।",
          userNotFound: "उपयोगकर्ता नहीं मिला",
          accountInactive: "खाता निष्क्रिय",
          
          // ===== SIDEBAR / NAVIGATION =====
          dashboard: "डैशबोर्ड",
          applyLeave: "अवकाश के लिए आवेदन करें",
          myLeaveStatus: "मेरे अवकाश की स्थिति",
          seniorDetails: "वरिष्ठ अधिकारी विवरण",
          pendingApprovals: "लंबित स्वीकृतियाँ",
          reports: "रिपोर्ट्स",
          allUsers: "सभी उपयोगकर्ता",
          editProfile: "प्रोफ़ाइल संपादित करें",
          logout: "लॉग आउट",
          
          // ===== DASHBOARD =====
          welcome: "स्वागत है",
          employeeDashboard: "कर्मचारी डैशबोर्ड",
          myLeaveOverview: "मेरा अवकाश विवरण",
          leaveApprovalOverview: "अवकाश स्वीकृति विवरण",
          recentLeaveRequests: "हाल के अवकाश अनुरोध",
          noLeaveRecords: "कोई अवकाश रिकॉर्ड नहीं मिला।",
          quickActions: "त्वरित कार्य",
          viewLeaveStatus: "अवकाश स्थिति देखें",
          
          // ===== STATS =====
          pending: "लंबित",
          approved: "स्वीकृत",
          rejected: "अस्वीकृत",
          draft: "ड्राफ्ट",
          active: "सक्रिय",
          inactive: "निष्क्रिय",
          totalLeaves: "कुल अवकाश",
          usedLeaves: "प्रयुक्त अवकाश",
          pendingRequests: "लंबित अनुरोध",
          
          // ===== APPLY LEAVE =====
          editLeave: "अवकाश संपादित करें",
          selectLeaveType: "अवकाश प्रकार चुनें",
          leaveType: "अवकाश प्रकार",
          fromDate: "से तारीख",
          toDate: "तक तारीख",
          reason: "कारण",
          totalDays: "कुल दिन",
          days: "दिन",
          validForChildCare: "बाल देखभाल अवकाश के लिए मान्य",
          saveDraft: "ड्राफ्ट सहेजें",
          updateLeave: "अवकाश अपडेट करें",
          pleaseSelectLeaveType: "कृपया अवकाश प्रकार चुनें",
          
          // ===== LEAVE TYPES =====
          casual: "आकस्मिक",
          sick: "बीमारी",
          earned: "अर्जित",
          emergency: "आपातकालीन",
          childCare: "बाल देखभाल",
          
          // ===== LEAVE STATUS =====
          leaveStatus: "अवकाश स्थिति",
          employee: "कर्मचारी",
          dates: "तारीखें",
          numberOfDays: "दिनों की संख्या",
          submittedOn: "जमा करने की तारीख",
          assignedTo: "को सौंपा गया",
          status: "स्थिति",
          actions: "कार्य",
          rejectionReason: "अस्वीकृति का कारण",
          reasonNotProvided: "कारण नहीं दिया गया",
          noLeaveRequests: "कोई अवकाश अनुरोध नहीं मिला",
          showingResults: "दिखा रहे हैं",
          of: "का",
          prev: "पिछला",
          next: "अगला",
          allStatus: "सभी स्थिति",
          
          // ===== PENDING LEAVE =====
          pendingLeaves: "लंबित अवकाश",
          noPendingLeaves: "आपको कोई लंबित अवकाश नहीं सौंपा गया है।",
          approve: "स्वीकृत करें",
          reject: "अस्वीकार करें",
          forward: "अग्रेषित करें",
          
          // ===== EDIT PROFILE =====
          profileDetails: "प्रोफ़ाइल विवरण",
          updateContact: "संपर्क अपडेट करें",
          name: "नाम",
          role: "भूमिका",
          rank: "पद",
          area: "क्षेत्र",
          circleOffice: "सर्कल कार्यालय",
          policeStation: "थाना",
          contactNumber: "संपर्क नंबर",
          enterContactNumber: "10 अंकों का संपर्क नंबर दर्ज करें",
          saveChanges: "परिवर्तन सहेजें",
          profileUpdated: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई",
          
          // ===== SENIOR DETAILS =====
          seniorOfficers: "वरिष्ठ अधिकारी",
          
          // ===== ADMIN / USERS =====
          users: "उपयोगकर्ता",
          addUser: "उपयोगकर्ता जोड़ें",
          allRoles: "सभी भूमिकाएं",
          allRanks: "सभी पद",
          email: "ईमेल",
          edit: "संपादित करें",
          
          // ===== RANKS =====
          constable: "कांस्टेबल",
          headConstable: "हेड कांस्टेबल",
          si: "एसआई",
          inspector: "इंस्पेक्टर",
          shoSo: "एसएचओ/एसओ",
          co: "सीओ",
          sp: "एसपी",
          ssp: "एसएसपी",
          
          // ===== VALIDATION =====
          childCareOnlyFemale: "बाल देखभाल अवकाश केवल महिला कर्मचारियों के लिए उपलब्ध है।",
          childCareMinDays: "बाल देखभाल अवकाश कम से कम 6 महीने (180 दिन) का होना चाहिए।",
          youSelected: "आपने चुना",
          
          // ===== SUBTITLES/DESCRIPTIONS =====
          manageAllPersonnel: "सभी पुलिस कर्मियों का प्रबंधन करें",
          activePersonnelDesc: "वर्तमान में सक्रिय कर्मी",
          inactivePersonnelDesc: "वर्तमान में निष्क्रिय कर्मी",
          latestLeaveApplications: "नवीनतम 5 अवकाश आवेदन",
          reviewPendingRequests: "लंबित अनुरोधों की समीक्षा करें और कार्रवाई करें",
          trackLeaveApplications: "अपने अवकाश आवेदनों को देखें और ट्रैक करें",
          yourLeaveStats: "आपके अवकाश आवेदन की सांख्यिकी",
          requestsPendingApproval: "आपकी स्वीकृति के लंबित अनुरोध",
          yourLatestApplications: "आपके नवीनतम अवकाश आवेदन",
          
          // ===== ADMIN DASHBOARD =====
          sspDashboard: "एसएसपी डैशबोर्ड",
          welcomeBack: "वापसी पर स्वागत है",
          leaveOverview: "अवकाश अवलोकन",
          systemLeaveStats: "सिस्टम-व्यापी अवकाश सांख्यिकी",
          totalLeavesApplied: "कुल आवेदित अवकाश",
          pendingApproval: "स्वीकृति लंबित",
          approvedLeaves: "स्वीकृत अवकाश",
          rejectedLeaves: "अस्वीकृत अवकाश",
          forwardedLeaves: "अग्रेषित अवकाश",
          usersOverview: "उपयोगकर्ता अवलोकन",
          activeUsers: "सक्रिय उपयोगकर्ता",
          inactiveUsers: "निष्क्रिय उपयोगकर्ता",
          
          // ===== MISC =====
          noDataFound: "कोई डेटा नहीं मिला",
          loading: "लोड हो रहा है...",
          error: "त्रुटि",
          success: "सफल",
          cancel: "रद्द करें",
          confirm: "पुष्टि करें",
          yes: "हाँ",
          no: "नहीं",
          search: "खोजें",
          filter: "फ़िल्टर",
          clear: "साफ़ करें",
          close: "बंद करें",
          openSidebar: "साइडबार खोलें",
          closeSidebar: "साइडबार बंद करें",
        }
      }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;