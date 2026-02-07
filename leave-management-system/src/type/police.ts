/* ===============================
   BASIC ENUM / UNION TYPES
================================ */

export type Role = "ADMIN" | "POLICE";

export type Rank =
  | "CONSTABLE"
  | "HEAD_CONSTABLE"
  | "SI"
  | "SHO/SO"
  | "INSPECTOR"
  | "CO"
  | "SP"
  | "SSP";

export type SPType = "CITY" | "RURAL";

export type Gender = "MALE" | "FEMALE";

export type OfficeType =
  | "SSP_OFFICE"
  | "SP_CITY_OFFICE"
  | "SP_RURAL_OFFICE"
  | "CAMP_OFFICE"
  | "TRAFFIC_OFFICE";

/* ===============================
   CORE USER TYPES
================================ */

export interface BaseUser {
  id: string;
  pno: string; // Unique Police Number
  name: string;
  contact: string;
  email: string;
  role: Role;
  rank: Rank;
  gender?: Gender;
  isActive: boolean;
  createdAt: string;
}

/**
 * SP must have CITY or RURAL type
 */
export interface SPUser extends BaseUser {
  rank: "SP";
  spType: SPType;
}

/**
 * SSP user
 */
export interface SSPUser extends BaseUser {
  rank: "SSP";
}

/**
 * Police user except SP & SSP
 */
export interface RegularPoliceUser extends BaseUser {
  rank: Exclude<Rank, "SP" | "SSP">;
  policeStation: string;
  circle?: string;
}

/**
 * Union of all police users
 */
export type PoliceUser =
  | RegularPoliceUser
  | SPUser
  | SSPUser;

/**
 * Admin user
 */
export interface AdminUser extends BaseUser {
  role: "ADMIN";
  rank: "SSP"; // Admin mapped at top level
}

/**
 * Any system user
 */
export type User = PoliceUser | AdminUser;

/* ===============================
   POLICE STRUCTURE TYPES
================================ */

export interface PoliceStation {
  id: string;
  name: string;
  circleOfficerId: string;
}

export interface CircleOfficer {
  id: string;
  name: string;
  rank: "CO";
  spType: SPType;
  policeStations: PoliceStation[];
}

export interface SPOffice {
  id: string;
  type: SPType;
  circleOfficers: CircleOfficer[];
}

export interface SSPOffice {
  id: string;
  offices: OfficeType[];
}

/* ===============================
   LEAVE TYPES
================================ */

export type LeaveType =
  | "CASUAL"
  | "EARNED"
  | "MEDICAL"
  | "CHILD_CARE";

export interface LeaveApplication {
  id: string;
  applicantPNO: string;
  applicantRank: Rank;
  applicantGender?: Gender;
  leaveType: LeaveType;
  leaveDays: number;
  appliedAt: string;
  status: LeaveStatus;
}

export type LeaveStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "AUTO_FORWARDED";

/* ===============================
   LEAVE APPROVAL FLOW TYPES
================================ */

export interface LeaveAuthority {
  rank: Rank;
  spType?: SPType;
  pno?: string;
  name?: string;
  contact?: string;
}

export interface LeaveApprovalFlow {
  firstAuthority: LeaveAuthority;
  autoForwardAfter24Hrs: boolean;
  autoForwardTo?: LeaveAuthority;
  finalAuthority: LeaveAuthority;
}

/* ===============================
   HIERARCHY RESPONSE TYPE
================================ */

export interface UpperHierarchy {
  rank: Rank;
  pno: string;
  name: string;
  contact: string;
  spType?: SPType;
}

/**
 * Used in dashboard profile
 */
export interface UserHierarchyProfile {
  user: PoliceUser;
  upperHierarchy: UpperHierarchy[];
}

/* ===============================
   MOCK API RESPONSE TYPES
================================ */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/* ===============================
   USER CREATE / UPDATE PAYLOADS
================================ */

export interface CreatePoliceUserPayload {
  pno: string;
  name: string;
  email: string;
  contact: string;
  rank: Rank;
  spType?: SPType;
  policeStation?: string;
  gender?: Gender;
  password: string;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  contact: string;
  password: string;
}

export interface UpdateUserPayload {
  name?: string;
  contact?: string;
  isActive?: boolean;
}
