export type LeaveStatusType =
  | "APPROVED"
  | "REJECTED"
  | "PENDING"
  | "DRAFT"
  | "FORWARDED";

export interface Leave {
  id: string;
  leaveType: string;
  from: string;
  to: string;
  reason: string;
  status: LeaveStatusType;
  submittedOn?: string;
  assignedTo?: string;
  employeeName: string;
}
