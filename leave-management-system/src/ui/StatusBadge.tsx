import React from "react";

interface Props {
  status: string;
  colorMap: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
}

const StatusBadge: React.FC<Props> = ({ status, colorMap, className, children }) => (
  <span
    className={`inline-block px-2 py-1 rounded text-xs font-medium border ${colorMap[status] || ""} ${className || ""}`}
  >
    {children || status}
  </span>
);

export default StatusBadge;