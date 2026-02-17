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
import { API_BASE_URL } from "../config";
// Helper to check if an object is a valid LeaveApproval
function isValidLeaveApproval(obj: any): obj is import("../type/leave").LeaveApproval {
  return obj && typeof obj === "object" &&
    typeof obj.approverId === "string" &&
    typeof obj.approverRank === "string" &&
    (obj.action === "APPROVED" || obj.action === "REJECTED" || obj.action === "FORWARDED") &&
    typeof obj.timestamp === "string";
}

// Create context
const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const useLeaves = () => {
  const ctx = useContext(LeaveContext);
  if (!ctx) throw new Error("useLeaves must be used within LeaveProvider");
  return ctx;
};

export { getApprovalChain, canApproverApprove, validateChildCareLeave };

export const LeaveProvider = ({ children }: { children: ReactNode }) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);

  // Debug: Log leaves whenever they change
  useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log("[DEBUG] Leaves state updated:", leaves);
  }, [leaves]);
  const { user } = useAuth();
  const { users } = useUsers();

  // Fetch leaves from backend on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/leaves`)
      .then((res) => res.json())
      .then((data) => {
        // eslint-disable-next-line no-console
        // console.log("[DEBUG] Leaves fetched from backend:", data);
        setLeaves(Array.isArray(data) ? data : []);
      })
      .catch(() => setLeaves([]));
  }, []);

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
        return users.find((u) => (u.rank === "SSP" && (u.role === "POLICE" || u.role === "ADMIN") && u.isActive));
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

  // Auto-forward logic (unchanged)
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
              // Update on backend
              fetch(`${API_BASE_URL}/leaves/${leave.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  status: "FORWARDED",
                  currentApproverId: nextApprover.id,
                  currentApproverName: nextApprover.name,
                  currentApproverRank: nextApprover.rank,
                  lastForwardedAt: new Date().toISOString(),
                  approvals: [
                    ...leave.approvals,
                    {
                      approverId: leave.currentApproverId ?? "",
                      approverRank: leave.currentApproverRank ?? "",
                      action: "FORWARDED",
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
                }),
              });
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

  // API-integrated addLeave
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
      type: payload.leaveType,
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
    fetch(`${API_BASE_URL}/leaves`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLeave),
    })
      .then((res) => res.json())
      .then((savedLeave) => setLeaves((prev) => [savedLeave, ...prev]));
  };

  // API-integrated editLeave
  const editLeave = (id: string, updated: Partial<Leave>) => {
    fetch(`${API_BASE_URL}/leaves/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then((updatedLeave) =>
        setLeaves((prev) =>
          prev.map((l) => (l.id === id ? updatedLeave : l))
        )
      );
  };

  // API-integrated approveLeave
  const approveLeave = (id: string, approverId: string, remarks?: string) => {
    setLeaves((prev) =>
      prev.map((leave) => {
        if (leave.id !== id || (leave.status !== "PENDING" && leave.status !== "FORWARDED")) return { ...leave };
        const approvals = [
          ...leave.approvals,
          {
            approverId: approverId,
            approverRank: leave.currentApproverRank ?? "",
            approverName: leave.currentApproverName ?? "",
            action: "APPROVED" as const,
            timestamp: new Date().toISOString(),
            reason: remarks,
          },
        ].filter(isValidLeaveApproval);

        // Update backend
        fetch(`${API_BASE_URL}/leaves/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "APPROVED",
            currentApproverId: undefined,
            currentApproverName: undefined,
            currentApproverRank: undefined,
            approvals,
            lastUpdatedOn: new Date().toISOString(),
          }),
        })
          .then(() => {
            // Re-fetch leaves after approval to ensure UI is up-to-date
            fetch(`${API_BASE_URL}/leaves`)
              .then((res) => res.json())
              .then((data) => setLeaves(Array.isArray(data) ? data : []))
              .catch(() => {});
          });

        return {
          ...leave,
          status: "APPROVED" as LeaveStatus,
          currentApproverId: undefined,
          currentApproverName: undefined,
          currentApproverRank: undefined,
          approvals,
          lastUpdatedOn: new Date().toISOString(),
        };
      })
    );
  };

  // API-integrated rejectLeave
  const rejectLeave = (id: string, approverId: string, reason?: string) => {
    setLeaves((prev) =>
      prev.map((leave) => {
        if (leave.id !== id || (leave.status !== "PENDING" && leave.status !== "FORWARDED")) return { ...leave };
        const approvals = [
          ...leave.approvals,
          {
            approverId: approverId,
            approverRank: leave.currentApproverRank ?? "",
            approverName: user?.name ?? leave.currentApproverName ?? "",
            action: "REJECTED" as const,
            timestamp: new Date().toISOString(),
            reason: reason,
          },
        ].filter(isValidLeaveApproval);

        // Update backend
        fetch(`${API_BASE_URL}/leaves/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "REJECTED",
            currentApproverId: undefined,
            currentApproverName: undefined,
            currentApproverRank: undefined,
            approvals,
            Reason: reason,
            lastUpdatedOn: new Date().toISOString(),
          }),
        })
          .then(() => {
            // Re-fetch leaves after rejection to ensure UI is up-to-date
            fetch(`${API_BASE_URL}/leaves`)
              .then((res) => res.json())
              .then((data) => setLeaves(Array.isArray(data) ? data : []))
              .catch(() => {});
          });

        return {
          ...leave,
          status: "REJECTED" as LeaveStatus,
          currentApproverId: undefined,
          currentApproverName: undefined,
          currentApproverRank: undefined,
          approvals,
          Reason: reason,
          lastUpdatedOn: new Date().toISOString(),
        };
      })
    );
  };

  // API-integrated forwardLeave
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
        const approvals = [
          ...leave.approvals,
          {
            approverId: user?.id ?? "",
            approverRank: user?.rank ?? "",
            approverName: user?.name ?? "",
            action: "FORWARDED" as const,
            timestamp: new Date().toISOString(),
            reason: reason || "Forwarded to next authority",
          },
        ].filter(isValidLeaveApproval);

        // Update backend
        fetch(`${API_BASE_URL}/leaves/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "FORWARDED",
            currentApproverId: nextApprover.id,
            currentApproverName: nextApprover.name,
            currentApproverRank: nextApprover.rank,
            lastForwardedAt: new Date().toISOString(),
            approvals,
            forwardHistory: [
              ...(leave.forwardHistory || []),
              {
                fromRank: leave.currentApproverRank,
                toRank: nextApprover.rank!,
                forwardedAt: new Date().toISOString(),
                reason: reason || "Forwarded to next authority",
              },
            ],
          }),
        });

        return {
          ...leave,
          status: "FORWARDED" as LeaveStatus,
          currentApproverId: nextApprover.id,
          currentApproverName: nextApprover.name,
          currentApproverRank: nextApprover.rank,
          lastForwardedAt: new Date().toISOString(),
          approvals,
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