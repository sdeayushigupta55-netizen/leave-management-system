import React, { createContext, useContext, useState } from "react";

const LeaveContext = createContext();

export const useLeave = () => useContext(LeaveContext);

export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([
    // Initial demo data (can be empty or prefilled)
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

  const addLeave = (leave) => {
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
