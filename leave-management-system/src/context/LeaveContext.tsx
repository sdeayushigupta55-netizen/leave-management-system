import { createContext, useContext, useEffect, useState } from "react";
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
  const rankHierarchy = ["CONSTABLE", "HEAD_CONSTABLE", "SI", "INSPECTOR", "SHO"];
  

 const getImmediateSeniorId = (rank?: string, policeStation?: string) => {
  const currentRankIndex = rankHierarchy.indexOf(rank ?? user?.rank ?? "CONSTABLE");
  const nextRank = rankHierarchy[currentRankIndex + 1];
  if (!nextRank) return undefined;
  return users.find(
    (u) =>
      u.role === "POLICE" &&
      u.rank === nextRank &&
      u.policeStation === (policeStation ?? user?.policeStation)
  )?.id;
};
  

  const addLeave = (
    payload: ApplyLeavePayload,
    status: LeaveStatus = "PENDING"
  ) => {
    if (!user) return; // safety check
    const fromDate = new Date(payload.from);
    const toDate = new Date(payload.to);
    const diffTime = toDate.getTime() - fromDate.getTime();
    const numberOfDays = Math.abs(Math.round(diffTime / (1000 * 60 * 60 * 24))) + 1;
    const newLeave: Leave = {
      id: crypto.randomUUID(),
      applicantId: user.id,
      applicantRank: user.rank ?? "CONSTABLE", // fallback or make optional in type
      name: user.name,
      policeStation: user.policeStation ?? "",

      leaveType: payload.leaveType,
      from: payload.from,
      to: payload.to,
      reason: payload.reason,
      numberOfDays: numberOfDays,
      status,
      approvalChain: ["HEAD_CONSTABLE", "SI", "INSPECTOR", "SHO"],
      approvals: [],

      currentApproverId: status === "PENDING" ? getImmediateSeniorId() : undefined,
      submittedOn: new Date().toISOString(),
    };

    setLeaves(prev => [newLeave, ...prev]);
  };

 const editLeave = (id: string, updated: Partial<Leave>) => {
  setLeaves(prev =>
    prev.map(l =>
      l.id === id
        ? {
            ...l,
            ...updated,
            status: updated.status === "PENDING" ? "PENDING" : l.status,
            currentApproverId:
              updated.status === "PENDING"
                ? getImmediateSeniorId(l.applicantRank, l.policeStation)
                : l.currentApproverId,
          }
        : l
    )
  );
};
const approveLeave = (id: string) => {
  setLeaves((prev) =>
    prev.map((leave) =>
      leave.id === id ? { ...leave, status: "APPROVED" } : leave
    )
  );
};
const rejectLeave = (id: string, reason: string) => {
  setLeaves((prev) =>
    prev.map((leave) =>
      leave.id === id
        ? { ...leave, status: "REJECTED", rejectionReason: reason }
        : leave
    )
  );
};
// const forwardLeave = (id: string, reason: string) => {
//   setLeaves((prev) =>
//     prev.map((leave) =>
//       leave.id === id
//         ? { ...leave, status: "FORWARDED", rejectionReason: reason }
//         : leave
//     )
//   );
// };

  return (
  <LeaveContext.Provider value={{
  leaves,
  addLeave,
  editLeave,
  approveLeave,
  rejectLeave,
  // forwardLeave,
}}>
  {children}
</LeaveContext.Provider>
  );
};
