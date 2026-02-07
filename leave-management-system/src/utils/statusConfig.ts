import type { LeaveStatus } from "../type/leave";

export type UserStatus = "ACTIVE" | "INACTIVE";

// Government theme colors
export const statusColorMap: Record<LeaveStatus, string> = {
  APPROVED: "bg-[#e8f5e9] border-[#138808] text-[#138808]",
  REJECTED: "bg-[#ffebee] border-[#c62828] text-[#c62828]",
  PENDING: "bg-[#fff3e0] border-[#FF9933] text-[#e65100]",
  FORWARDED: "bg-[#efebe9] border-[#8d6e63] text-[#6d4c41]",
  DRAFT: "bg-[#e8eaf6] border-[#1a237e] text-[#1a237e]",
};

export const userStatusColorMap: Record<UserStatus, string> = {
  ACTIVE: "bg-[#e8f5e9] border-[#138808] text-[#138808]",
  INACTIVE: "bg-[#ffebee] border-[#c62828] text-[#c62828]",
};