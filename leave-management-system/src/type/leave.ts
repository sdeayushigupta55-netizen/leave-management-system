import type { PoliceRank } from "./user";

export type LeaveStatus =
  | "DRAFT"
  | "PENDING"
  | "FORWARDED"
  | "APPROVED"
  | "REJECTED";

export type LeaveType =
  | "CASUAL"
  | "SICK"
  | "EARNED"
  | "EMERGENCY"
  | "CHILD_CARE"
  | "MEDICAL"
  | "PATERNITY"
  | "MATERNITY"
  | "OPTIONAL";

export interface LeaveApproval {
  approverId: string;
  approverRank: string;
  action: "APPROVED" | "REJECTED" | "FORWARDED";
  timestamp: string;
  reason?: string;
  approverName?: string;
}

export interface ForwardHistory {
  fromRank?: string;
  toRank: string;
  forwardedAt: string;
  reason: string;
}

export interface Leave {
  type: string;
  id: string;
  applicantId: string;
  applicantRank: PoliceRank;
  name: string;
  policeStation: string;
  circleOffice?: string;
  gender?: string;
  leaveType: LeaveType;
  from: string;
  to: string;
  reason: string;
  numberOfDays: number;
  status: LeaveStatus;

  currentApproverId?: string;
  currentApproverName?: string;
  currentApproverRank?: string;

  approvalChain: string[];
  approvals: LeaveApproval[];

  Reason?: string;
  submittedOn: string;
  lastUpdatedOn?: string;
  lastForwardedAt?: string;
  forwardHistory?: ForwardHistory[];

  attachment?: string;
}

export interface ApplyLeavePayload {
  leaveType: LeaveType;
  from: string;
  to: string;
  reason: string;
  attachment?: string;
}

export interface LeaveContextType {
  leaves: Leave[];
  addLeave: (payload: ApplyLeavePayload, status?: LeaveStatus) => void;
  editLeave: (id: string, updated: Partial<Leave>) => void;
  approveLeave: (id: string, approverId: string, remarks?: string) => void;
  rejectLeave: (id: string, reason: string) => void;
  forwardLeave: (id: string, reason?: string) => void;
}