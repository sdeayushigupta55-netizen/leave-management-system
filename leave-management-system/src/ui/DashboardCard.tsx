type DashboardCardProps = {
  title: string;
  value: number | string;
  color?: string;
  icon?: React.ReactNode;
};

const DashboardCard = ({
  title,
  value,
  color = "text-gray-800",
  icon,
}: DashboardCardProps) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow flex items-center gap-4">
      {icon && (
        <div className="p-3 bg-gray-200 rounded-full">
          {icon}
        </div>
      )}

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {title}
        </p>
        <p className={`text-2xl font-bold ${color}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;
