
import type { PoliceRank } from "./user";
export type LeaveStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";
  export type LeaveType =
  | "CASUAL"
  | "SICK"
  | "EARNED"
  | "EMERGENCY";
// ================= LEAVE MODEL ======================
export interface Leave {
  id: string;

  applicantId: string;
  applicantRank: PoliceRank;
  name: string;
  policeStation: string;

  leaveType: LeaveType;
  from: string;
  to: string;
  reason: string;
  numberOfDays: number;
  status: LeaveStatus;

  // 🔑 who must act now (SHO / Inspector / SP)
  currentApproverId?: string;

  // approval flow
  approvalChain: PoliceRank[];
  approvals: LeaveApproval[];

  rejectionReason?: string;
  submittedOn: string;
  lastUpdatedOn?: string;
}


// ================= LEAVE APPROVAL VIEW MODEL ====================== 


export interface LeaveApprovalView {
  leaveId: string;

  applicant: {
    id: string;
    name: string;
    rank: PoliceRank;
    policeStation: string;
  };

  leaveType: string;
  from: string;
  to: string;
  reason: string;

  status: LeaveStatus;
  currentApproverId?: string;

  approvedBy: {
    id: string;
    name: string;
    rank: PoliceRank;
  }[];

  forwardedHistory: {
    fromName: string;
    toName: string;
    forwardedOn: string;
  }[];
}
export interface LeaveApproval {
  approverId: string;      // User ID
  approverRank: PoliceRank;
  action: "APPROVED" | "REJECTED" | "FORWARDED";
  remarks?: string;
  actionOn: string;        // ISO date
}
export interface ForwardLeavePayload {
  fromApproverId: string;
  toApproverId: string;
  toApproverRank: PoliceRank;
}
export interface Leave {
  id: string;

  applicantId: string;          // Police user ID
  applicantRank: PoliceRank;    // Rank at apply time

  from: string;                 // YYYY-MM-DD
  to: string;

  leaveType: LeaveType;
  reason: string;

  status: LeaveStatus;

  // Who must act now (SHO / Inspector / SP etc.)
  currentApproverId?: string;

  // Expected approval flow based on rules
  approvalChain: PoliceRank[];

  // Full approval / forward history
  approvals: LeaveApproval[];

  rejectionReason?: string;

  submittedOn: string;
  lastUpdatedOn?: string;
}
export interface ApplyLeavePayload {
  from: string;
  to: string;
  leaveType: LeaveType;
  reason: string;
}
export interface EditLeavePayload {
  from?: string;
  to?: string;
  leaveType?: LeaveType;
  reason?: string;
}
export interface LeaveActionPayload {
  leaveId: string;
  action: "APPROVE" | "REJECT" | "FORWARD";
  remarks?: string;
}
export interface LeaveFilter {
  status?: LeaveStatus;
  leaveType?: LeaveType;
  fromDate?: string; // ISO Date string
  toDate?: string;   // ISO Date string
}
export interface LeaveContextType {
  leaves: Leave[];
  addLeave: (payload: ApplyLeavePayload, status?: LeaveStatus) => void;
  editLeave: (id: string, updated: Partial<Leave>) => void;
  approveLeave: (id: string) => void;
  rejectLeave: (id: string, reason: string) => void;
  // forwardLeave: (id: string, reason: string) => void;
}