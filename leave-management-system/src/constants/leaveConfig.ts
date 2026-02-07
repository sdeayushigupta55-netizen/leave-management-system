/**
 * Leave Management Configuration Constants
 */

// Auto-forward time: 24 hours in milliseconds
// Change to smaller value for testing (e.g., 30 * 60 * 1000 for 30 minutes)
export const AUTO_FORWARD_TIME = 24 * 60 * 60 * 1000; // 24 hours

// Check interval for auto-forward (1 minute)
export const AUTO_FORWARD_CHECK_INTERVAL = 60 * 1000; // 1 minute

// Approval authority limits (in days)
export const APPROVAL_LIMITS = {
  SHO_SO: 3,    // SHO/SO can approve ≤3 days
  CO: 7,        // CO can approve ≤7 days
  SP: 15,       // SP can approve ≤15 days
  SSP: Infinity // SSP can approve any duration
} as const;

// Ranks that have direct chain to SP for leaves ≤3 days
export const DIRECT_SP_CHAIN_RANKS = ["SI", "INSPECTOR", "SHO/SO", "CO"] as const;

// Ranks that go through full chain (C/CH)
export const FULL_CHAIN_RANKS = ["CONSTABLE", "HEAD_CONSTABLE"] as const;

// Child Care Leave minimum duration
export const CHILD_CARE_LEAVE_MIN_DAYS = 180; // 6 months
