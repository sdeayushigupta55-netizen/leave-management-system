import type { LeaveStatusType } from "../../type/leave";

interface Props {
  status: LeaveStatusType;
}

const statusColorMap: Record<LeaveStatusType, string> = {
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
  PENDING: "bg-yellow-500",
  DRAFT: "bg-gray-500",
  FORWARDED: ""
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-block px-2 py-1 rounded text-white text-xs font-medium
      ${statusColorMap[status]}`}
    >
      {status}
    </span>
  );
}