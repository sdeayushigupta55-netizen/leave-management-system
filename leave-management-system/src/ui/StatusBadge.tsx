import React from "react";
import { useTranslation } from "react-i18next";
import { statusToKey } from "../utils/translationHelper";

interface Props {
  status: string;
  colorMap: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
  translateStatus?: boolean; // Enable auto-translation
}

const StatusBadge: React.FC<Props> = ({ 
  status, 
  colorMap, 
  className, 
  children,
  translateStatus = true // Default: translate
}) => {
  const { t } = useTranslation();
  
  // Get translated status
  const displayText = translateStatus 
    ? t(statusToKey[status] || status.toLowerCase()) 
    : status;

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${colorMap[status] || ""} ${className || ""}`}
    >
      {children || displayText}
    </span>
  );
};

export default StatusBadge;