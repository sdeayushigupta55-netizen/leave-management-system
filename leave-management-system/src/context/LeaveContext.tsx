import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { useUsers } from "./UserContext";
import type { Leave, LeaveStatus, ApplyLeavePayload, LeaveContextType } from "../type/leave";
import { AUTO_FORWARD_TIME, AUTO_FORWARD_CHECK_INTERVAL } from "../constants/leaveConfig";
import {
  getApprovalChain,
  getApproverRankByDays,
  canApproverApprove,
} from "../utils/leaveApprovalChain";
import {
  validateChildCareLeave,
  calculateNumberOfDays,
} from "../utils/leaveValidation";

// Create context
const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const useLeaves = () => {
  const ctx = useContext(LeaveContext);
  if (!ctx) throw new Error("useLeaves must be used within LeaveProvider");
  return ctx;
};

export { getApprovalChain, canApproverApprove, validateChildCareLeave };

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
        return users.find((u) => u.rank === "SSP" && u.isActive);
      }
      return undefined;
    },
    [users]
  );

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
      if (!approverRank) {
        return { id: undefined, name: undefined, rank: undefined };
      }
      const approver = getApproverByRank(approverRank, policeStation, circleOffice);
      return {
        id: approver?.id,
        name: approver?.name,
        rank: approverRank,
      };
    },
    [getApproverByRank]
  );

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

  useEffect(() => {
    const checkAndForwardLeaves = () => {
      const now = Date.now();
      setLeaves((prev) =>
        prev.map((leave) => {
          if (leave.status !== "PENDING" || !leave.currentApproverRank) return leave;
          const lastActionTime = leave.lastForwardedAt
            ? new Date(leave.lastForwardedAt).getTime()
            : new Date(leave.submittedOn).getTime();
          const timePassed = now - lastActionTime;
          if (timePassed >= AUTO_FORWARD_TIME) {
            const nextApprover = getNextApprover(
              leave.currentApproverRank,
              leave.approvalChain,
              leave.policeStation,
              leave.circleOffice
            );
            if (nextApprover.id) {
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
                    approverId: leave.currentApproverId ?? "",
                    approverRank: leave.currentApproverRank ?? "",
                    action: "FORWARDED" as const,
                    timestamp: new Date().toISOString(),
                    reason: "Not approved within 24 hours - Auto forwarded",
                  },
                ],
                forwardHistory: [
                  ...(leave.forwardHistory || []),
                  {
                    fromRank: leave.currentApproverRank,
                    toRank: nextApprover.rank!,
                    forwardedAt: new Date().toISOString(),
                    reason: "Not approved within 24 hours - Auto forwarded",
                  },
                ],
              };
            }
          }
          return leave;
        })
      );
    };
    const interval = setInterval(checkAndForwardLeaves, AUTO_FORWARD_CHECK_INTERVAL);
    checkAndForwardLeaves();
    return () => clearInterval(interval);
  }, [getNextApprover]);

  const addLeave = (
    payload: ApplyLeavePayload,
    status: LeaveStatus = "PENDING"
  ) => {
    if (!user) return;
    const numberOfDays = calculateNumberOfDays(payload.from, payload.to);
    const applicantRank = user.rank ?? "CONSTABLE";
    const gender = user.gender;
    const childCareValidation = validateChildCareLeave(
      gender,
      payload.leaveType,
      numberOfDays
    );
    if (!childCareValidation.valid) {
      alert(`❌ ${childCareValidation.error}`);
      return;
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
      attachment: payload.attachment ?? undefined,
    };
    setLeaves((prev) => [newLeave, ...prev]);
  };

  const editLeave = (id: string, updated: Partial<Leave>) => {
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        let numberOfDays = l.numberOfDays;
        if (updated.from || updated.to) {
          numberOfDays = calculateNumberOfDays(
            updated.from ?? l.from,
            updated.to ?? l.to
          );
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
          currentApproverId: approver.id,
          currentApproverName: approver.name,
          currentApproverRank: approver.rank,
          attachment: updated.attachment ?? l.attachment,
        };
      })
    );
  };

  const approveLeave = (id: string, approverId: string, remarks?: string) => {
    // Implement your approve logic here if needed
  };

  const rejectLeave = (id: string, approverId: string, reason?: string) => {
    // Implement your reject logic here if needed
  };

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