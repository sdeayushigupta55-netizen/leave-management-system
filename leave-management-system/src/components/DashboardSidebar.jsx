import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";

const DashboardSidebar = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      path: "/employee",
      icon: "🏠",
      roles: [ROLES.JUNIOR, ROLES.SENIOR, ROLES.HOD, ROLES.ADMIN],
    },
    {
      label: "Apply Leave",
      path: "/employee/apply-leave",
      icon: "📝",
      roles: [ROLES.JUNIOR],
    },
    {
      label: "My Leave Status",
      path: "/employee/leave-status",
      icon: "📋",
      roles: [ROLES.JUNIOR],
    },
    {
      label: "Pending Approvals",
      path: "/senior",
      icon: "✅",
      roles: [ROLES.SENIOR],
    },
    {
      label: "Department Approvals",
      path: "/hod",
      icon: "🏢",
      roles: [ROLES.HOD],
    },
    {
      label: "Reports",
      path: "/admin",
      icon: "📊",
      roles: [ROLES.ADMIN],
    },
  ];

  const filteredMenu = menuItems.filter(item =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden bg-primary text-white p-2 rounded shadow"
        onClick={() => setOpen(true)}
      >
        ☰
      </button>

      {/* Desktop Sidebar */}
      <aside className="w-64 min-h-screen bg-gray-900 text-white hidden md:block">
        <SidebarContent menu={filteredMenu} />
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden"
          onClick={() => setOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 h-full w-64 bg-gray-900 text-white"
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent menu={filteredMenu} onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
};

const SidebarContent = ({ menu, onClose }) => (
  <>
    <div className="px-4 py-4 border-b border-gray-700">
      <h2 className="text-lg font-semibold">Police Leave System</h2>
      <p className="text-xs text-gray-400">Government of Uttar Pradesh</p>
    </div>

    <nav className="mt-4">
      {menu.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onClose}
          {...(item.path === "/employee" ? { end: true } : {})}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm
            ${isActive ? "bg-primary" : "text-gray-300 hover:bg-gray-800"}`
          }
        >
          <span>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  </>
);

export default DashboardSidebar;
