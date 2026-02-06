// Maps for converting data values to translation keys
export const leaveTypeToKey: Record<string, string> = {
  CASUAL: "casual",
  SICK: "sick",
  EARNED: "earned",
  EMERGENCY: "emergency",
  CHILD_CARE: "childCare",
};

export const statusToKey: Record<string, string> = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  DRAFT: "draft",
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export const rankToKey: Record<string, string> = {
  CONSTABLE: "constable",
  HEAD_CONSTABLE: "headConstable",
  SI: "si",
  INSPECTOR: "inspector",
  "SHO/SO": "shoSo",
  CO: "co",
  SP: "sp",
  SSP: "ssp",
};

export const roleToKey: Record<string, string> = {
  POLICE: "police",
  ADMIN: "admin",
};

// Helper function to get translation key
export const getTranslationKey = (
  value: string,
  map: Record<string, string>
): string => {
  return map[value] || value.toLowerCase();
};