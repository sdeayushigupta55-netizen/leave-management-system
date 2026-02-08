
export type PoliceRank  =
  | "CONSTABLE"
  | "HEADCONSTABLE"
  | "SI"
  | "SHO/SO"
  | "INSPECTOR"
  | "CO"
  | "SP"
  | "SSP";
// ================= SYSTEM ROLES =====================
export type UserRole = "POLICE" | "ADMIN";

// ================= AUTH USER ======================
export interface AuthUser {
  password: string;
  id: string;
  name: string;
  pno: string; // Unique Police Number
  contact: string; 
  role: UserRole;
  isActive: boolean;
  rank?: PoliceRank;
  circleOffice?: string;
  area?: "SP-CITY" | "SP-RURAL";
  gender?: "MALE" | "FEMALE";
  policeStation?: string; 
}

// ================= PAYLOADS ========================
export interface CreatePoliceUserPayload {
  name: string;
  email: string;
  contact: string; 
  role: "POLICE";
  rank: PoliceRank;
  policeStation: string;
  reportingOfficerId?: string;
  password: string;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  role: "ADMIN";
  contact: string; 
  policeStation: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
 
}
export interface UpdateUserPayload {
  name?: string;
  email?: string;
  contact: string; 
  role?: UserRole;
  rank?: PoliceRank;
  policeStation?: string;
  reportingOfficerId?: string;
  password?: string;
}



export interface User {
  id: string;
  pno: string;               // ✅ NEW
  name: string;
  // email?: string;
  contact: string;
  role: "POLICE" | "ADMIN";
  rank?: PoliceRank;
  circleOffice?: string;
  policeStation?: string;
  area?: "SP-CITY" | "SP-RURAL";
  gender?: "MALE" | "FEMALE";
  isActive: boolean;
  createdAt: string;
  password?: string; // demo only
}

export const POLICE_HIERARCHY = {
  "SP-CITY": {
    "CO City": [
      "North",
      "South",
      "Ramgarh",
      "Rasulapur"
    ],
    "CO Tundla": [
      "Tundla",
      "Narkhi",
      "Pachokhara",
      "Nagla Sindhi",
      "Rojavali"
    ],
    "CO Sadar": [
      "Matsena",
      "Basai Mohammadpur",
      "Linepar",
      "Women Police Station"
    ]
  },
  "SP-RURAL": {
    "CO Shikohabad": [
      "Shikohabad",
      "Khergarh",
      "Makhnapur"
    ],
    "CO Sirsaganj": [
      "Nagla Khangar",
      "Nasirpur",
      "Sirsaganj",
      "Arang"
    ],
    "CO Jasrana": [
      "Jasrana",
      "Eka",
      "Fariha"
    ]
  }
};

