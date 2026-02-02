import React from "react";

type StatCardProps = {
  title: string;
  value: number;
  color: "pending" | "approved" | "rejected" | "draft";
};

const colorMap: Record<StatCardProps["color"], string> = {
  pending: "bg-yellow-50 border border-yellow-200 text-yellow-700",
  approved: "bg-green-50 border border-green-200 text-green-700",
  rejected: "bg-red-50 border border-red-200 text-red-700",
  draft: "bg-gray-50 border border-gray-200 text-gray-700",
};

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <div className={`rounded p-4 ${colorMap[color]}`}>
    <p className="text-medium">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default StatCard;