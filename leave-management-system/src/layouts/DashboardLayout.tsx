import { useState } from "react";
import type { PropsWithChildren } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";

const DashboardLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-[#e8eaf6] relative">
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader
          sidebarCollapsed={collapsed}
          setSidebarOpen={setMobileOpen}
        />
        <main className="flex-1 flex flex-col p-4 md:p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;