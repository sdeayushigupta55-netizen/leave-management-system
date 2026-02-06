
  
// ================= SYSTEM ROLES =====================
export type UserRole = "POLICE" | "ADMIN";

// ================= AUTH USER ======================
export interface AuthUser {
  password: string;
  id: string;
  name: string;
  uno: string; // Unique Police Number
  contact: string; 
  role: UserRole;
  isActive: boolean;
  rank?: PoliceRank;
  circleOffice?: string;
  area?: "CITY" | "RURAL";
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







export type PoliceRank  =
  | "CONSTABLE"
  | "HEAD_CONSTABLE"
  | "SI"
  | "SHO/SO"
  | "INSPECTOR"
  | "CO"
  | "SP"
  | "SSP";

export interface User {
  id: string;
  uno: string;               // ✅ NEW
  name: string;
  email?: string;
  contact: string;
  role: "POLICE" | "ADMIN";
  rank?: PoliceRank;
  circleOffice?: string;
  policeStation?: string;
  area?: "CITY" | "RURAL";
  gender?: "MALE" | "FEMALE";
  isActive: boolean;
  createdAt: string;
  password?: string; // demo only
}
