/**
 * Leave Validation Utilities
 * 
 * This module contains validation functions for leave applications.
 */

import { CHILD_CARE_LEAVE_MIN_DAYS } from "../constants/leaveConfig";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate Child Care Leave application
 * 
 * Rules:
 * - Only available for female employees
 * - Must be at least 6 months (180 days)
 */
export const validateChildCareLeave = (
  gender: string | undefined,
  leaveType: string,
  numberOfDays: number
): ValidationResult => {
  if (leaveType !== "CHILD_CARE") {
    return { valid: true };
  }

  if (gender !== "FEMALE") {
    return {
      valid: false,
      error: "Child Care Leave is only available for female employees.",
    };
  }

  if (numberOfDays < CHILD_CARE_LEAVE_MIN_DAYS) {
    return {
      valid: false,
      error: `Child Care Leave must be at least 6 months (${CHILD_CARE_LEAVE_MIN_DAYS} days).`,
    };
  }

  return { valid: true };
};

/**
 * Calculate number of days between two dates (inclusive)
 */
export const calculateNumberOfDays = (from: string, to: string): number => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffTime = toDate.getTime() - fromDate.getTime();
  return Math.abs(Math.round(diffTime / (1000 * 60 * 60 * 24))) + 1;
};

/**
 * Validate date range
 */
export const validateDateRange = (from: string, to: string): ValidationResult => {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(fromDate.getTime())) {
    return { valid: false, error: "Invalid start date." };
  }

  if (isNaN(toDate.getTime())) {
    return { valid: false, error: "Invalid end date." };
  }

  if (fromDate > toDate) {
    return { valid: false, error: "Start date cannot be after end date." };
  }

  return { valid: true };
};

/**
 * Validate leave reason
 */
export const validateLeaveReason = (reason: string): ValidationResult => {
  if (!reason || reason.trim().length === 0) {
    return { valid: false, error: "Reason is required." };
  }

  if (reason.trim().length < 10) {
    return { valid: false, error: "Please provide a more detailed reason (at least 10 characters)." };
  }

  return { valid: true };
};
