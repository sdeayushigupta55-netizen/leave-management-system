import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import type { Leave } from "../type/leave"; // 1. Import the Leave type
 // 1. Import the Leave type

interface LeaveContextType {
  leaves: Leave[];
  addLeave: (
    leave: Omit<Leave, "id" | "submittedOn" | "status" | "assignedTo">,
    status?: "DRAFT" | "PENDING"
  ) => void;
  editLeave: (id: string, updated: Partial<Omit<Leave, "id">>) => void; // 2. id is string
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
          id: "1", // 3. id as string
          leaveType: "Sicksss",
          from: "Apr 25",
          to: "Apr 25",
          reason: "Flu recovery",
          submittedOn: "Apr 25",
          status: "PENDING",
          assignedTo: "N/A",
          employeeName: "John D."
        },
        {
          id: "2",
          leaveType: "Casual",
          from: "Apr 15",
          to: "Apr 18",
          reason: "Home shifting",
          submittedOn: "Apr 07",
          status: "APPROVED",
          assignedTo: "Sarah M.",
          employeeName: "Mike T."
        },
        {
          id: "3",
          leaveType: "Casual",
          from: "Apr 15",
          to: "Apr 18",
          reason: "Home shifting",
          submittedOn: "Apr 07",
          status: "REJECTED",
          assignedTo: "Sarah M.",
          employeeName: "Linda K."
        },
        {
          id: "4",
          leaveType: "Casual",
          from: "Apr 15",
          to: "Apr 18",
          reason: "Home shifting",
          submittedOn: "Apr 07",
          status: "DRAFT",
          assignedTo: "Sarah M.",
          employeeName: "David S."
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
        id: prev.length ? (parseInt(prev[0].id, 10) + 1).toString() : "1", // 4. id as string
        submittedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status,
        assignedTo: "N/A",
        employeeName: "N/A"
      },
      ...prev
    ]);
  };

  const editLeave = (id: string, updated: Partial<Omit<Leave, "id">>) => { // 5. id is string
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