
import type { PoliceRank, UserRole } from "../type/user";

export const POLICE_RANKS: PoliceRank[] = [
  "CONSTABLE",
  "HEAD_CONSTABLE",
  "SI",
  "CO",
  "INSPECTOR",
  "SHO/SO",
  "SP",
  "SSP"
];

export const SENIOR_RANKS: PoliceRank[] = [
  "CONSTABLE",
  "HEAD_CONSTABLE",
  "SI",
  "CO",
  "INSPECTOR",
  "SHO/SO",
  "SP",
  "SSP"
] as const;

export const ROLES: Record<UserRole, UserRole> = {
  POLICE: "POLICE",
  ADMIN: "ADMIN",

};

export const USER_ROLES: UserRole[] = ["POLICE", "ADMIN"];