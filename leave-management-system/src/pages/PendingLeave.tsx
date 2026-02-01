import { useLeave } from "../context/LeaveContext";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";


import PendingLeaveStatusTable from "../components/leave/PendingLeaveStatusTable";

const PendingLeave = () => {
    const { leaves, approveLeave, rejectLeave } = useLeave();
    const { user } = useAuth();

    // Filter leaves assigned to the current user and pending, but not their own
    const pendingLeaves = leaves.filter(
        (leave) =>
            leave.status === "PENDING" &&
            leave.currentApproverId === user?.id &&
            leave.applicantId !== user?.id
    );
    console.log("Logged in user:", user);
    console.log("Pending leaves for this user:", pendingLeaves);
    return (
        <DashboardLayout>
            <div>
                <h2 className="text-xl font-bold mb-4">Pending Leaves</h2>
                {pendingLeaves.length === 0 ? (
                    <div>No pending leaves assigned to you.</div>
                ) : (
                    <PendingLeaveStatusTable
                        leaves={pendingLeaves}
                        onApprove={approveLeave}
                        onReject={(id) => rejectLeave(id, "No reason provided")}
                    //   onForward={forwardLeave}
                    //   onEdit={editLeave}
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default PendingLeave;