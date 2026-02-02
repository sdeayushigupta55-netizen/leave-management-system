

import type { PoliceRank, UserRole } from "../type/user";

export const POLICE_RANKS: PoliceRank[] = [
  "CONSTABLE",
  "HEAD_CONSTABLE",
  "SI",
  "INSPECTOR",
  "SHO",
  "SP"
];

export const SENIOR_RANKS: PoliceRank[] = [
  "HEAD_CONSTABLE",
  "SI",
  "INSPECTOR",
  "SHO",
  "SP",
] as const;

export const ROLES: Record<UserRole, UserRole> = {
  POLICE: "POLICE",
  ADMIN: "ADMIN",

};

export const USER_ROLES: UserRole[] = ["POLICE", "ADMIN"];