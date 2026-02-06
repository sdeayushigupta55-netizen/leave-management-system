type DashboardCardProps = {
  title: string;
  value: number | string;
  color?: string;
  icon?: React.ReactNode;
};

const DashboardCard = ({
  title,
  value,
  color = "text-[#1a237e]",
  icon,
}: DashboardCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-[#c5a200] flex items-center gap-4">
      {icon && (
        <div className="p-3 bg-[#e8eaf6] rounded-xl text-[#1a237e]">
          {icon}
        </div>
      )}

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
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
