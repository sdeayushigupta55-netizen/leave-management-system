import React from "react";

type StatCardProps = {
  title: string;
  value: number;
  color: "pending" | "approved" | "rejected" | "draft";
};

const colorMap: Record<StatCardProps["color"], { bg: string; border: string; text: string; icon: string }> = {
  pending: { 
    bg: "bg-gradient-to-br from-[#fff8e1] to-[#ffecb3]", 
    border: "border-[#FF9933]", 
    text: "text-[#f57c00]",
    icon: "⏳"
  },
  approved: { 
    bg: "bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9]", 
    border: "border-[#138808]", 
    text: "text-[#138808]",
    icon: "✅"
  },
  rejected: { 
    bg: "bg-gradient-to-br from-[#ffebee] to-[#ffcdd2]", 
    border: "border-[#c62828]", 
    text: "text-[#c62828]",
    icon: "❌"
  },
  draft: { 
    bg: "bg-gradient-to-br from-[#e8eaf6] to-[#c5cae9]", 
    border: "border-[#1a237e]", 
    text: "text-[#1a237e]",
    icon: "📝"
  },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <div className={`rounded-xl p-4 border-l-4 shadow-sm hover:shadow-md transition-shadow ${colorMap[color].bg} ${colorMap[color].border}`}>
    <div className="flex items-center justify-between mb-2">
      <p className={`text-sm font-medium ${colorMap[color].text}`}>{title}</p>
      <span className="text-lg">{colorMap[color].icon}</span>
    </div>
    <p className={`text-2xl font-bold ${colorMap[color].text}`}>{value}</p>
  </div>
);

export default StatCard;