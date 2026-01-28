import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useEffect } from "react";

export interface Leave {
  id: number;
  leaveType: string;
  from: string;
  to: string;
  reason: string;
  submittedOn: string;
  status: string;
  assignedTo: string;
}

interface LeaveContextType {
  leaves: Leave[];
  addLeave: (
    leave: Omit<Leave, "id" | "submittedOn" | "status" | "assignedTo">,
    status?: "DRAFT" | "PENDING"
  ) => void;
  editLeave: (id: number, updated: Partial<Omit<Leave, "id">>) => void;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const useLeave = (): LeaveContextType => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error("useLeave must be used within a LeaveProvider");
  }
  return context;
};

export const LeaveProvider = ({ children }: { children: ReactNode }) => {
  const [leaves, setLeaves] = useState<Leave[]>(
    () => {
      const stored = localStorage.getItem("leaves");
      if (stored) {
        return JSON.parse(stored);
      }
      return [
        {
          id: 1,
          leaveType: "Sicksss",
          from: "Apr 25",
          to: "Apr 25",
          reason: "Flu recovery",
          submittedOn: "Apr 25",
          status: "PENDING",
          assignedTo: "N/A"
        },
        {
          id: 2,
          leaveType: "Casual",
          from: "Apr 15",
          to: "Apr 18",
          reason: "Home shifting",
          submittedOn: "Apr 07",
          status: "APPROVED",
          assignedTo: "Sarah M."
        },
        {
          id: 3,
          leaveType: "Casual",
          from: "Apr 15",
          to: "Apr 18",
          reason: "Home shifting",
          submittedOn: "Apr 07",
          status: "REJECTED",
          assignedTo: "Sarah M."
        },
        {
          id: 4,
          leaveType: "Casual",
          from: "Apr 15",
          to: "Apr 18",
          reason: "Home shifting",
          submittedOn: "Apr 07",
          status: "DRAFT",
          assignedTo: "Sarah M."
        }
      ];
    }
  );
  useEffect(() => {
    localStorage.setItem("leaves", JSON.stringify(leaves));
  }, [leaves]);

  const addLeave = (
    leave: Omit<Leave, "id" | "submittedOn" | "status" | "assignedTo">,
    status: "DRAFT" | "PENDING" = "PENDING"
  ) => {
    setLeaves(prev => [
      {
        ...leave,
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        submittedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status,
        assignedTo: "N/A"
      },
      ...prev
    ]);
  };
const editLeave = (id: number, updated: Partial<Omit<Leave, "id">>) => {
  setLeaves(prev =>
    prev.map(leave =>
      leave.id === id ? { ...leave, ...updated } : leave
    )
  );
};
  return (
    <LeaveContext.Provider value={{ leaves, addLeave, editLeave }}>
      {children}
    </LeaveContext.Provider>
  );
};

