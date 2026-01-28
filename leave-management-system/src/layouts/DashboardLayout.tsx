import React from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";

const DashboardLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 flex flex-col p-4 md:p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;