import DashboardLayout from "../../layouts/DashboardLayout";
import { useLeave } from "../../context/LeaveContext";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../ui/StatusBadge";
import { statusColorMap } from "../../utils/statusConfig";

const AdminDashboard = () => {
  const { leaves } = useLeave();
  const { user } = useAuth();

  const totalLeaves = leaves.length;
  const pending = leaves.filter(l => l.status === "PENDING").length;
  const approved = leaves.filter(l => l.status === "APPROVED").length;
  const rejected = leaves.filter(l => l.status === "REJECTED").length;

  const recentLeaves = leaves.slice(0, 5);

  return (
    <DashboardLayout>
      <div className=" min-h-screen ">

        {/* Header */}
        <h1 className="text-xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mb-6">
          Welcome, {user?.name}
        </p>
        <div className="border rounded-lg p-4 sm:p-6 bg-gray-50 min-h-screen ">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card title="Total Leaves" value={totalLeaves} />
            <Card title="Pending" value={pending} color="text-yellow-600" />
            <Card title="Approved" value={approved} color="text-green-600" />
            <Card title="Rejected" value={rejected} color="text-red-600" />
          </div>

          {/* Recent Leaves */}
          <div className="hidden md:block w-full overflow-x-auto">
            <h2 className="font-semibold mb-3">Recent Leave Requests</h2>

            <table className="min-w-full bg-white rounded shadow border text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">Leave</th>
                  <th className="p-3 text-left">Dates</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.map(leave => (
                  <tr key={leave.id} className="border-t">
                    {/* <td className="p-2">{leave.employeeName}</td> */}
                    <td className="p-2">{leave.leaveType}</td>
                    <td className="p-2">{leave.from} - {leave.to}</td>
                    <td className="py-1 px-2 sm:py-2 sm:px-4">
                      <StatusBadge status={leave.status} colorMap={statusColorMap} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

/* Reusable Card */
const Card = ({
  title,
  value,
  color = "text-gray-800",
}: {
  title: string;
  value: number;
  color?: string;
}) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);


