import type { LeaveStatus } from "../type/leave";

export type UserStatus = "ACTIVE" | "INACTIVE";

export const statusColorMap: Record<LeaveStatus, string> = {
  APPROVED: "bg-green-50 border-green-700 text-green-700",
  REJECTED: "bg-red-50 border-red-700 text-red-700",
  PENDING: "bg-yellow-50 border-yellow-700 text-yellow-700",
  DRAFT: "bg-gray-50 border-gray-700 text-gray-700",
  
};

export const userStatusColorMap: Record<UserStatus, string> = {
  ACTIVE: "bg-green-50 border-green-700 text-green-700",
  INACTIVE: "bg-red-50 border-red-700 text-red-700",
};