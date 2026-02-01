import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import type { UserRole } from "../type/user";

const DashboardSidebar = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // ================= MENU =====================
  const menuItems: {
    label: string;
    path: string;
    // icon: string;
    roles: UserRole[];
    ranks?: string[];
  }[] = [
    {
      label: "Dashboard",
      path: "/police",
      // icon: "🏠",
      roles: ["POLICE"],
    },
    {
      label: "Apply Leave",
      path: "/police/apply-leave",
      // icon: "📝",
      roles: ["POLICE"],
    },
    {
      label: "My Leave Status",
      path: "/police/leave-status",
      // icon: "📋",
      roles: ["POLICE"],
    },
    {
      label: "Pending Approvals",
      path: "/police/pending-leave",
      // icon: "✅",
      roles: ["POLICE"],
      ranks: ["HEAD_CONSTABLE", "SI", "INSPECTOR", "SHO"], // Only for senior ranks
    },
    {
      label: "Reports",
      path: "/admin",
      // icon: "📊",
      roles: ["ADMIN"],
    },
    {
      label: "All users",
      path: "/admin/all-users",
      // icon: "📊",
      roles: ["ADMIN"],
    },
  ];

  // Filter menu based on logged-in user's role and rank
  const filteredMenu = menuItems.filter(item =>
    item.roles.includes(user?.role as UserRole) &&
    (!item.ranks || item.ranks.includes(user?.rank ?? "CONSTABLE"))
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 md:hidden bg-primary text-white  rounded shadow"
        onClick={() => setOpen(true)}
      >
        <PanelRightOpen size={24} />
      </button>

      {/* Sidebar (slides for mobile, static for desktop) */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-white z-30
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:block
        `}
        style={{ minHeight: "100vh" }}
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-5 right-2 md:hidden text-white text-2xl"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <PanelLeftOpen size={24} />
        </button>
        <SidebarContent menu={filteredMenu} onClose={() => setOpen(false)} />
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

// ================= SIDEBAR CONTENT =================
type SidebarContentProps = {
  menu: {
    label: string;
    path: string;
    // icon: string;
    roles: UserRole[];
  }[];
  onClose?: () => void;
};

const SidebarContent: React.FC<SidebarContentProps> = ({ menu, onClose }) => (
  <>
    <div className="px-4 py-4 border-b border-gray-700">
      <div className="flex-1 flex justify-center">
      <img
        src="https://auth.mygov.in/sites/all/themes/mygovauth/logo.png"
        alt="MyGov Auth"
        className="h-10 md:h-12"
      />
    </div>
    </div>

    <nav className="mt-4">
      {menu.map(item => (
       <NavLink
  key={item.path}
  to={item.path}
  onClick={onClose}
  {...(item.path === "/police" ? { end: true } : {})}
  className={({ isActive }) =>
    `flex items-center justify-center gap-3 px-8 py-3 text-medium
    ${isActive ? "bg-primary" : "text-gray-300 hover:bg-gray-800"}`
  }
>
  <span className="flex-1 text-align-justify">{item.label}</span>
</NavLink>
      ))}
    </nav>
  </>
);

export default DashboardSidebar;