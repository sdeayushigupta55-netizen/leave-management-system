/**
 * Leave Approval Chain Utilities
 * 
 * This module contains functions for determining the approval chain
 * based on applicant rank, leave duration, and leave type.
 */

import { APPROVAL_LIMITS, CHILD_CARE_LEAVE_MIN_DAYS } from "../constants/leaveConfig";

type ApproverRank = "SHO/SO" | "CO" | "SP" | "SSP";

/**
 * Get the approval chain based on applicant rank, number of days, leave type, and gender
 * 
 * Rules:
 * - C/CH: SHO/SO → CO → SP → SSP (can be shorter based on days)
 * - SI/Inspector/SHO/SO/CO: ≤3 days → SP → SSP, >3 days → Direct SSP
 * - SP: Direct to SSP
 * - Child Care Leave (6 months+, female only): Direct to SSP
 */
export const getApprovalChain = (
  applicantRank: string,
  numberOfDays: number,
  leaveType: string,
  gender?: string
): string[] => {
  // Child Care Leave: direct to SSP (for female employees only, 6 months minimum)
  if (leaveType === "CHILD_CARE" && gender === "FEMALE" && numberOfDays >= CHILD_CARE_LEAVE_MIN_DAYS) {
    return ["SSP"];
  }

  // C/CH goes through full chain with SHO/SO as first authority
  if (applicantRank === "CONSTABLE" || applicantRank === "HEAD_CONSTABLE") {
    // ≤3 days: SHO/SO can approve, but higher chain exists
    if (numberOfDays <= APPROVAL_LIMITS.SHO_SO) {
      return ["SHO/SO", "CO", "SP", "SSP"];
    }
    // ≤7 days: SHO/SO forwards to CO (CO can approve)
    if (numberOfDays <= APPROVAL_LIMITS.CO) {
      return ["SHO/SO", "CO", "SP", "SSP"];
    }
    // ≤15 days: SHO/SO → CO → SP (SP can approve)
    if (numberOfDays <= APPROVAL_LIMITS.SP) {
      return ["SHO/SO", "CO", "SP", "SSP"];
    }
    // >15 days (including 1 month+): Full chain, only SSP can approve
    return ["SHO/SO", "CO", "SP", "SSP"];
  }

  // SI/Inspector goes to SP first, then SSP
  if (applicantRank === "SI" || applicantRank === "INSPECTOR") {
    // ≤3 days: SP can approve
    if (numberOfDays <= APPROVAL_LIMITS.SHO_SO) {
      return ["SP", "SSP"];
    }
    // >3 days: Direct to SSP
    return ["SSP"];
  }

  // SHO/SO goes to SP first, then SSP
  if (applicantRank === "SHO/SO") {
    // ≤3 days: SP can approve
    if (numberOfDays <= APPROVAL_LIMITS.SHO_SO) {
      return ["SP", "SSP"];
    }
    // >3 days: Direct to SSP
    return ["SSP"];
  }

  // CO goes to SP first, then SSP
  if (applicantRank === "CO") {
    // ≤3 days: SP can approve
    if (numberOfDays <= APPROVAL_LIMITS.SHO_SO) {
      return ["SP", "SSP"];
    }
    // >3 days: Direct to SSP
    return ["SSP"];
  }

  // SP's leave goes directly to SSP
  if (applicantRank === "SP") {
    return ["SSP"];
  }

  // Default chain for any other rank
  return ["SSP"];
};

/**
 * Get the initial approver rank based on days
 * This determines which rank should be the first approver
 */
export const getApproverRankByDays = (
  applicantRank: string,
  numberOfDays: number,
  leaveType: string,
  gender?: string
): ApproverRank | undefined => {
  // Child Care Leave goes directly to SSP
  if (leaveType === "CHILD_CARE" && gender === "FEMALE" && numberOfDays >= CHILD_CARE_LEAVE_MIN_DAYS) {
    return "SSP";
  }

  // C/CH always starts with SHO/SO
  if (applicantRank === "CONSTABLE" || applicantRank === "HEAD_CONSTABLE") {
    return "SHO/SO";
  }

  // SI/Inspector leaves
  if (applicantRank === "SI" || applicantRank === "INSPECTOR") {
    // ≤3 days: Go to SP
    if (numberOfDays <= APPROVAL_LIMITS.SHO_SO) {
      return "SP";
    }
    // >3 days: Direct to SSP
    return "SSP";
  }

  // SHO/SO leaves
  if (applicantRank === "SHO/SO") {
    // ≤3 days: Go to SP
    if (numberOfDays <= APPROVAL_LIMITS.SHO_SO) {
      return "SP";
    }
    // >3 days: Direct to SSP
    return "SSP";
  }

  // CO leaves
  if (applicantRank === "CO") {
    // ≤3 days: Go to SP
    if (numberOfDays <= APPROVAL_LIMITS.SHO_SO) {
      return "SP";
    }
    // >3 days: Direct to SSP
    return "SSP";
  }

  // SP leaves go directly to SSP
  if (applicantRank === "SP") {
    return "SSP";
  }

  // Default: go to SSP
  return "SSP";
};

/**
 * Check if the current approver can approve the leave or must forward it
 * 
 * @returns true if approver can approve, false if must forward
 */
export const canApproverApprove = (
  approverRank: string,
  numberOfDays: number,
  applicantRank: string
): boolean => {
  // C/CH leaves - follow the approval authority limits
  if (applicantRank === "CONSTABLE" || applicantRank === "HEAD_CONSTABLE") {
    // SHO/SO can only approve leaves ≤3 days, must forward leaves >3 days
    if (approverRank === "SHO/SO") {
      return numberOfDays <= APPROVAL_LIMITS.SHO_SO;
    }

    // CO can only approve leaves ≤7 days, must forward leaves >7 days
    if (approverRank === "CO") {
      return numberOfDays <= APPROVAL_LIMITS.CO;
    }

    // SP can only approve leaves ≤15 days, must forward leaves >15 days
    if (approverRank === "SP") {
      return numberOfDays <= APPROVAL_LIMITS.SP;
    }

    // SSP can approve any leave
    return approverRank === "SSP";
  }

  // For SI/Inspector/SHO/SO/CO applying for leave
  // If leave is ≤3 days and current approver is SP, SP can approve
  if (approverRank === "SP" && numberOfDays <= APPROVAL_LIMITS.SHO_SO) {
    return true;
  }

  // SP can only approve leaves ≤15 days, must forward leaves >15 days (including 1 month)
  if (approverRank === "SP") {
    return numberOfDays <= APPROVAL_LIMITS.SP;
  }

  // SSP can approve any leave (final authority)
  return approverRank === "SSP";
};

/**
 * Get the next approver rank in the chain
 */
export const getNextApproverRank = (
  currentRank: string,
  approvalChain: string[]
): string | undefined => {
  const currentIndex = approvalChain.indexOf(currentRank);
  if (currentIndex === -1 || currentIndex >= approvalChain.length - 1) {
    return undefined;
  }
  return approvalChain[currentIndex + 1];
};
