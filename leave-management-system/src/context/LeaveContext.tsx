import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


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
  addLeave: (leave: Omit<Leave, "id" | "submittedOn" | "status" | "assignedTo">) => void;
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
  const [leaves, setLeaves] = useState<Leave[]>([
    {
      id: 1,
      leaveType: "Sick",
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
    }
  ]);

  const addLeave = (leave: Omit<Leave, "id" | "submittedOn" | "status" | "assignedTo">) => {
    setLeaves(prev => [
      {
        ...leave,
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        submittedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: "PENDING",
        assignedTo: "N/A"
      },
      ...prev
    ]);
  };

  return (
    <LeaveContext.Provider value={{ leaves, addLeave }}>
      {children}
    </LeaveContext.Provider>
  );
};