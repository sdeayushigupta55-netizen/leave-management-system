import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { PanelRightOpen } from "lucide-react";
import type { UserRole } from "../type/user";

const DashboardSidebar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const menuItems: {
    labelKey: string;
    path: string;
    roles: UserRole[];
    ranks?: string[];
  }[] = [
    {
      labelKey: "dashboard",
      path: "/police",
      roles: ["POLICE"],
    },
    {
      labelKey: "applyLeave",
      path: "/police/apply-leave",
      roles: ["POLICE"],
      ranks: ["SHO/SO", "CO", "SP", "INSPECTOR","SI", "HEAD_CONSTABLE","CONSTABLE"],
    },
    {
      labelKey: "myLeaveStatus",
      path: "/police/leave-status",
      roles: ["POLICE"],
      ranks: ["SHO/SO", "CO", "SP", "INSPECTOR","SI", "HEAD_CONSTABLE","CONSTABLE"],
    },
    {
      labelKey: "seniorDetails",
      path: "/police/senior-details",
      roles: ["POLICE"],
      ranks: ["SHO/SO", "CO", "SP", "INSPECTOR","SI", "HEAD_CONSTABLE","CONSTABLE"],
    },
    {
      labelKey: "pendingApprovals",
      path: "/police/pending-leave",
      roles: ["POLICE"],
      ranks: ["SHO/SO", "CO", "SP", "SSP"],
    },
    // {
    //   labelKey: "reports",
    //   path: "/ssp",
    //   roles: ["POLICE"],
    //   ranks: ["SSP"],
    // },
    {
      labelKey: "allUsers",
      path: "/ssp/all-users",
      roles: ["POLICE"],
      ranks: ["SSP"],
    },
  ];

  const filteredMenu = menuItems.filter(
    (item) =>
      item.roles.includes(user?.role as UserRole) &&
      (!item.ranks || item.ranks.includes(user?.rank ?? "CONSTABLE"))
  );

  return (
    <>
      <button
        className="fixed left-4 md:hidden bg-[#1a237e] text-white rounded shadow p-2"
        onClick={() => setOpen(true)}
        aria-label={t("openSidebar")}
      >
        <PanelRightOpen size={24} />
      </button>

      <aside
        className={`
          fixed md:static top-0 left-0 bg-[#0d1b2a] text-white z-30
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:block
          overflow-y-auto
          w-[200px] md:w-[220px] lg:w-64
          shrink-0
        `}
        style={{ minHeight: "100vh" }}
      >
        {/* <button
          className="absolute top-5 right-2 md:hidden text-white text-2xl"
          onClick={() => setOpen(false)}
          aria-label={t("closeSidebar")}
        >
          <PanelLeftOpen size={24} />
        </button> */}
        <SidebarContent menu={filteredMenu} onClose={() => setOpen(false)} t={t} />
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

type SidebarContentProps = {
  menu: {
    labelKey: string;
    path: string;
    roles: UserRole[];
  }[];
  onClose?: () => void;
  t: (key: string) => string;
};

const SidebarContent: React.FC<SidebarContentProps> = ({ menu, onClose, t }) => (
  <>
    <div className="px-4 py-4 border-b border-[#1a237e]">
      <div className="flex-1 flex justify-center">
        <img
          src="https://auth.mygov.in/sites/all/themes/mygovauth/logo.png"
          alt="MyGov Auth"
          className="h-10 md:h-12"
        />
      </div>
    </div>

    <nav className="mt-4 flex flex-col gap-1 px-2">
      {menu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onClose}
          {...(item.path === "/police" || item.path === "/ssp" ? { end: true } : {})}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-3 rounded-lg transition text-sm
            ${isActive ? "bg-[#c5a200] text-[#0d1b2a] font-semibold" : "text-gray-300 hover:bg-[#1a237e]"}`
          }
        >
          <span className="whitespace-nowrap">{t(item.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  </>
);

export default DashboardSidebar;