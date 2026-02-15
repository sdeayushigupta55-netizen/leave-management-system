
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
  gender?: "Male" | "Female" | "OTHER";
  policeStation?: string; 
  profilPic?: string; // New field for profile picture URL
  createdAt: string;

}

// ================= PAYLOADS ========================
export interface CreatePoliceUserPayload {
  name: string;
 
  contact: string; 
  role: "POLICE";
  rank: PoliceRank;
  policeStation: string;
  reportingOfficerId?: string;
  password: string;
}

export interface CreateAdminUserPayload {
  name: string;
 
  role: "ADMIN";
  contact: string; 
  policeStation: string;
  password: string;
}


export interface UpdateUserPayload {
  name?: string;

  contact: string; 
  role?: UserRole;
  rank?: PoliceRank;
  policeStation?: string;
  reportingOfficerId?: string;
  password?: string;
}



export interface User {
  _id?: string;
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
  gender?: "Male" | "Female" | "OTHER";
  isActive: boolean;
  createdAt: string;
  password?: string; // demo only
  profilPic?: string; // New field for profile picture URL
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
    ],
    "CO LINE": [
       "RI RESERVE INSPECTER OFFICE",
       "GADNA OFFICE",
       "CASE OFFICE",
       "GD OFFICE",
       "QUATER GARD",
       "SURVEILLANCE CELL",
       "SOG",
       "GOPNEEY OFFICE",
       "MEDIA CELL",
       "TELEFON OFFICE",
       "IGRS OFFICE",
       "SHIKAYAT PRAKOST",
       "DCRB",
       "ELECTION CELL",
       "VIP CELL",
       "BADI PESI",
       "TRAFFIC OFFICE",
       "TRAFFIC CENTRE",
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
  },

};

