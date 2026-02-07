import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Leave, ApplyLeavePayload, LeaveStatus } from "../type/leave";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "./UserContext";
import type { LeaveContextType } from "../type/leave";

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const useLeave = (): LeaveContextType => {
  const ctx = useContext(LeaveContext);
  if (!ctx) throw new Error("useLeave must be used inside LeaveProvider");
  return ctx;
};

// 30 minutes in milliseconds (for testing)
const AUTO_FORWARD_TIME = 24 * 60 * 60 * 1000;


// Get approval chain based on applicant rank, number of days, and leave type
const getApprovalChain = (
  applicantRank: string,
  numberOfDays: number,
  leaveType: string,
  gender?: string
): string[] => {
  // Special case: Female Child Care Leave (minimum 6 months / 180 days) -> Direct to SSP
  if (
    gender === "FEMALE" &&
    leaveType === "CHILD_CARE" &&
    numberOfDays >= 180 &&
    ["CONSTABLE", "HEAD_CONSTABLE", "SI", "INSPECTOR", "SHO/SO", "CO", "SP"].includes(applicantRank)
  ) {
    return ["SSP"];
  }

  // For CONSTABLE and HEAD_CONSTABLE - all leaves go through full chain
  // SHO/SO can approve ≤3 days, CO can approve ≤7 days, SP can approve ≤15 days, SSP approves rest
  if (["CONSTABLE", "HEAD_CONSTABLE"].includes(applicantRank)) {
    return ["SHO/SO", "CO", "SP", "SSP"];
  }

  // SI, INSPECTOR, SHO/SO, CO:
  // ≤3 days -> SP -> SSP
  // >3 days -> Direct to SSP
  if (["SI", "INSPECTOR"].includes(applicantRank)) {
    if (numberOfDays <= 3) {
      return ["SP", "SSP"];
    }
    return ["SSP"]; // >3 days goes direct to SSP
  }

  // SHO/SO, CO:
  // ≤3 days -> SP -> SSP
  // >3 days -> Direct to SSP
  if (["SHO/SO", "CO"].includes(applicantRank)) {
    if (numberOfDays <= 3) {
      return ["SP", "SSP"];
    }
    return ["SSP"]; // >3 days goes direct to SSP
  }

  // SP -> SSP
  if (applicantRank === "SP") {
    return ["SSP"];
  }

  return [];
};

// Get the approver who can approve based on number of days
const getApproverRankByDays = (
  applicantRank: string,
  numberOfDays: number,
  leaveType: string,
  gender?: string
): string | undefined => {
  // Special case: Female Child Care Leave (minimum 6 months / 180 days) -> Direct to SSP
  if (
    gender === "FEMALE" &&
    leaveType === "CHILD_CARE" &&
    numberOfDays >= 180 &&
    ["CONSTABLE", "HEAD_CONSTABLE", "SI", "INSPECTOR", "SHO/SO", "CO", "SP"].includes(applicantRank)
  ) {
    console.log("Child Care Leave detected - routing to SSP");
    return "SSP";
  }

  // For CONSTABLE and HEAD_CONSTABLE - ALL leaves start with SHO/SO
  // SHO/SO will approve ≤3 days, forward rest to CO, then SP, then SSP
  if (["CONSTABLE", "HEAD_CONSTABLE"].includes(applicantRank)) {
    return "SHO/SO"; // Always starts with SHO/SO
  }

  // SI, INSPECTOR, SHO/SO, CO:
  // ≤3 days -> First goes to SP
  // >3 days -> Direct to SSP
  if (["SI", "INSPECTOR", "SHO/SO", "CO"].includes(applicantRank)) {
    if (numberOfDays <= 3) {
      return "SP"; // ≤3 days goes to SP first
    }
    return "SSP"; // >3 days goes direct to SSP
  }

  // SP -> SSP
  if (applicantRank === "SP") {
    return "SSP";
  }

  return undefined;
};

// Check if current approver can approve/reject or only forward
// Returns true if approver can approve, false if can only forward
export const canApproverApprove = (
  approverRank: string,
  numberOfDays: number,
  leaveType: string,
  gender?: string
): boolean => {
  // Special case: Child Care Leave - only SSP can approve
  if (gender === "FEMALE" && leaveType === "CHILD_CARE" && numberOfDays >= 180) {
    return approverRank === "SSP";
  }

  // SHO/SO can only approve leaves ≤3 days, must forward leaves >3 days
  if (approverRank === "SHO/SO") {
    return numberOfDays <= 3;
  }

  // CO can only approve leaves ≤7 days, must forward leaves >7 days
  if (approverRank === "CO") {
    return numberOfDays <= 7;
  }

  // SP can only approve leaves ≤15 days, must forward leaves >15 days (including 1 month)
  if (approverRank === "SP") {
    return numberOfDays <= 15;
  }

  // SSP can approve any leave (final authority)
  return approverRank === "SSP";
};

// Validation function for Child Care Leave
export const validateChildCareLeave = (
  gender: string | undefined,
  leaveType: string,
  numberOfDays: number
): { valid: boolean; error?: string } => {
  if (leaveType === "CHILD_CARE") {
    if (gender !== "FEMALE") {
      return { valid: false, error: "Child Care Leave is only available for female employees." };
    }
    if (numberOfDays < 180) {
      return { valid: false, error: "Child Care Leave must be at least 6 months (180 days)." };
    }
  }
  return { valid: true };
};

export const LeaveProvider = ({ children }: { children: ReactNode }) => {
  const [leaves, setLeaves] = useState<Leave[]>(() => {
    const stored = localStorage.getItem("leaves");
    return stored ? JSON.parse(stored) : [];
  });
  const { user } = useAuth();
  const { users } = useUsers();

  useEffect(() => {
    localStorage.setItem("leaves", JSON.stringify(leaves));
  }, [leaves]);

  // Get approver by rank
  const getApproverByRank = useCallback(
    (rank: string, policeStation?: string, circleOffice?: string) => {
      if (rank === "SHO/SO") {
        return users.find(
          (u) =>
            u.role === "POLICE" &&
            u.rank === "SHO/SO" &&
            u.policeStation === policeStation &&
            u.isActive
        );
      }
      if (rank === "CO") {
        return users.find(
          (u) =>
            u.role === "POLICE" &&
            u.rank === "CO" &&
            u.circleOffice === circleOffice &&
            u.isActive
        );
      }
      if (rank === "SP") {
        return users.find(
          (u) => u.role === "POLICE" && u.rank === "SP" && u.isActive
        );
      }
      if (rank === "SSP") {
        // SSP can be POLICE or ADMIN role
        return users.find((u) => u.rank === "SSP" && u.isActive);
      }
      return undefined;
    },
    [users]
  );

  // Get initial approver based on applicant rank and number of days
  const getInitialApprover = useCallback(
    (
      applicantRank: string,
      numberOfDays: number,
      leaveType: string,
      policeStation?: string,
      circleOffice?: string,
      gender?: string
    ) => {
      const approverRank = getApproverRankByDays(
        applicantRank,
        numberOfDays,
        leaveType,
        gender
      );
      if (!approverRank)
        return { id: undefined, name: undefined, rank: undefined };

      const approver = getApproverByRank(approverRank, policeStation, circleOffice);

      return {
        id: approver?.id,
        name: approver?.name,
        rank: approverRank,
      };
    },
    [getApproverByRank]
  );

  // Get next approver in chain
  const getNextApprover = useCallback(
    (
      currentApproverRank: string,
      approvalChain: string[],
      policeStation?: string,
      circleOffice?: string
    ) => {
      const currentIndex = approvalChain.indexOf(currentApproverRank);
      if (currentIndex === -1 || currentIndex >= approvalChain.length - 1) {
        return { id: undefined, name: undefined, rank: undefined };
      }

      const nextRank = approvalChain[currentIndex + 1];
      const approver = getApproverByRank(nextRank, policeStation, circleOffice);

      return {
        id: approver?.id,
        name: approver?.name,
        rank: nextRank,
      };
    },
    [getApproverByRank]
  );

  // Auto-forward leaves after 24 hours
  useEffect(() => {
    const checkAndForwardLeaves = () => {
      const now = Date.now();

      setLeaves((prev) =>
        prev.map((leave) => {
          // Only process PENDING leaves
          if (leave.status !== "PENDING" || !leave.currentApproverRank) {
            return leave;
          }

          const lastActionTime = leave.lastForwardedAt
            ? new Date(leave.lastForwardedAt).getTime()
            : new Date(leave.submittedOn).getTime();

          const timePassed = now - lastActionTime;

          // Check if 24 hours have passed
          if (timePassed >= AUTO_FORWARD_TIME) {
            const nextApprover = getNextApprover(
              leave.currentApproverRank,
              leave.approvalChain,
              leave.policeStation,
              leave.circleOffice
            );

            // If there's a next approver in chain
            if (nextApprover.id) {
              console.log(
                `Auto-forwarding leave ${leave.id} from ${leave.currentApproverRank} to ${nextApprover.rank}`
              );

              return {
                ...leave,
                currentApproverId: nextApprover.id,
                currentApproverName: nextApprover.name,
                currentApproverRank: nextApprover.rank,
                lastForwardedAt: new Date().toISOString(),
                forwardHistory: [
                  ...(leave.forwardHistory || []),
                  {
                    fromRank: leave.currentApproverRank,
                    toRank: nextApprover.rank!,
                    forwardedAt: new Date().toISOString(),
                    reason: "Auto-forwarded after 24 hours",
                  },
                ],
              };
            }
          }

          return leave;
        })
      );
    };

    // Check every minute
    const interval = setInterval(checkAndForwardLeaves, 60 * 1000);

    // Also check immediately on mount
    checkAndForwardLeaves();

    return () => clearInterval(interval);
  }, [getNextApprover]);

  const addLeave = (
    payload: ApplyLeavePayload,
    status: LeaveStatus = "PENDING"
  ) => {
    if (!user) return;

    const fromDate = new Date(payload.from);
    const toDate = new Date(payload.to);
    const diffTime = toDate.getTime() - fromDate.getTime();
    const numberOfDays =
      Math.abs(Math.round(diffTime / (1000 * 60 * 60 * 24))) + 1;

    const applicantRank = user.rank ?? "CONSTABLE";
    const gender = user.gender;

    // Validate Child Care Leave
    if (payload.leaveType === "CHILD_CARE") {
      if (gender !== "FEMALE") {
        alert("❌ Child Care Leave is only available for female employees.");
        return;
      }
      if (numberOfDays < 180) {
        alert(
          `❌ Child Care Leave must be at least 6 months (180 days).\n\nYou selected: ${numberOfDays} days.`
        );
        return;
      }
    }

    const approvalChain = getApprovalChain(
      applicantRank,
      numberOfDays,
      payload.leaveType,
      gender
    );

    const approver =
      status === "PENDING"
        ? getInitialApprover(
            applicantRank,
            numberOfDays,
            payload.leaveType,
            user.policeStation,
            user.circleOffice,
            gender
          )
        : { id: undefined, name: undefined, rank: undefined };

    console.log("Leave created:", {
      applicant: user.name,
      rank: applicantRank,
      numberOfDays,
      leaveType: payload.leaveType,
      gender,
      approvalChain,
      firstApprover: approver.name,
      firstApproverRank: approver.rank,
    });

    const newLeave: Leave = {
      id: crypto.randomUUID(),
      applicantId: user.id,
      applicantRank: applicantRank,
      name: user.name,
      policeStation: user.policeStation ?? "",
      circleOffice: user.circleOffice ?? "",
      gender: gender,
      leaveType: payload.leaveType,
      from: payload.from,
      to: payload.to,
      reason: payload.reason,
      numberOfDays: numberOfDays,
      status,
      approvalChain: approvalChain,
      approvals: [],
      currentApproverId: approver.id,
      currentApproverName: approver.name,
      currentApproverRank: approver.rank,
      submittedOn: new Date().toISOString(),
      forwardHistory: [],
    };

    setLeaves((prev) => [newLeave, ...prev]);
  };

  const editLeave = (id: string, updated: Partial<Leave>) => {
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;

        // Recalculate number of days if dates changed
        let numberOfDays = l.numberOfDays;
        if (updated.from || updated.to) {
          const fromDate = new Date(updated.from ?? l.from);
          const toDate = new Date(updated.to ?? l.to);
          const diffTime = toDate.getTime() - fromDate.getTime();
          numberOfDays =
            Math.abs(Math.round(diffTime / (1000 * 60 * 60 * 24))) + 1;
        }

        const leaveType = updated.leaveType ?? l.leaveType;
        const approvalChain = getApprovalChain(
          l.applicantRank,
          numberOfDays,
          leaveType,
          l.gender
        );

        let approver = {
          id: l.currentApproverId,
          name: l.currentApproverName,
          rank: l.currentApproverRank,
        };

        if (updated.status === "PENDING") {
          approver = getInitialApprover(
            l.applicantRank,
            numberOfDays,
            leaveType,
            l.policeStation,
            l.circleOffice,
            l.gender
          );
        }

        return {
          ...l,
          ...updated,
          numberOfDays,
          approvalChain,
          status: updated.status === "PENDING" ? "PENDING" : l.status,
          currentApproverId: approver.id,
          currentApproverName: approver.name,
          currentApproverRank: approver.rank,
        };
      })
    );
  };

  const approveLeave = (id: string) => {
    setLeaves((prev) =>
      prev.map((leave) =>
        leave.id === id
          ? {
              ...leave,
              status: "APPROVED" as LeaveStatus,
              approvals: [
                ...leave.approvals,
                {
                  approverId: user?.id ?? "",
                  approverRank: user?.rank ?? "",
                  action: "APPROVED" as const,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : leave
      )
    );
  };

  const rejectLeave = (id: string, reason: string) => {
    setLeaves((prev) =>
      prev.map((leave) =>
        leave.id === id
          ? {
              ...leave,
              status: "REJECTED" as LeaveStatus,
              rejectionReason: reason,
              approvals: [
                ...leave.approvals,
                {
                  approverId: user?.id ?? "",
                  approverRank: user?.rank ?? "",
                  action: "REJECTED" as const,
                  timestamp: new Date().toISOString(),
                  reason,
                },
              ],
            }
          : leave
      )
    );
  };

  // Manual forward to next approver
  const forwardLeave = (id: string, reason?: string) => {
    setLeaves((prev) =>
      prev.map((leave) => {
        if (leave.id !== id || !leave.currentApproverRank) return leave;

        const nextApprover = getNextApprover(
          leave.currentApproverRank,
          leave.approvalChain,
          leave.policeStation,
          leave.circleOffice
        );

        if (!nextApprover.id) return leave;

        return {
          ...leave,
          status: "FORWARDED" as LeaveStatus,
          currentApproverId: nextApprover.id,
          currentApproverName: nextApprover.name,
          currentApproverRank: nextApprover.rank,
          lastForwardedAt: new Date().toISOString(),
          approvals: [
            ...leave.approvals,
            {
              approverId: user?.id ?? "",
              approverRank: user?.rank ?? "",
              action: "FORWARDED" as const,
              timestamp: new Date().toISOString(),
              reason: reason || "Forwarded to next authority",
            },
          ],
          forwardHistory: [
            ...(leave.forwardHistory || []),
            {
              fromRank: leave.currentApproverRank,
              toRank: nextApprover.rank!,
              forwardedAt: new Date().toISOString(),
              reason: reason || "Forwarded to next authority",
            },
          ],
        };
      })
    );
  };

  return (
    <LeaveContext.Provider
      value={{
        leaves,
        addLeave,
        editLeave,
        approveLeave,
        rejectLeave,
        forwardLeave,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};