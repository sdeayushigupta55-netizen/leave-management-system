// ================= POLICE HIERARCHY =================
export type PoliceRank =
  | "CONSTABLE"
  | "HEAD_CONSTABLE"
  | "SI"
  | "INSPECTOR"
    | "SHO"
    | "SP";
//   | "SHO/SO"
//   | "SP_RURAL"
//   | "SP_URBAN";
  
// ================= SYSTEM ROLES =====================
export type UserRole = "POLICE" | "ADMIN";

// ================= USER MODEL ======================
export interface User {
  id: string;
  name: string;
  email: string;
  contact: string; 
  role: UserRole;
  rank?: PoliceRank;
  policeStation: string;
  reportingOfficerId?: string;
  isActive: boolean;
  createdAt: string;
  password?: string; // ⚠️ demo only
}

// ================= AUTH USER ======================
export interface AuthUser {
  password: string;
  id: string;
  name: string;
  email: string;
  contact: string; 
  role: UserRole;
  isActive: boolean;
  rank?: PoliceRank;
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
