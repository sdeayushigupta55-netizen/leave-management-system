import { useTranslation } from "react-i18next";
import { Check, X, Forward } from "lucide-react";
import { useState } from "react";

type PendingActionButtonsProps = {
  status: string;
  leaveId: string;
  canApprove: boolean; // Whether current approver can approve or only forward
  onApprove: (remarks?: string) => void;
  onReject: (remarks?: string) => void;
  onForward?: (remarks?: string) => void;
};

const PendingActionButtons = ({
  status,
  canApprove,
  onApprove,
  onReject,
  onForward,
}: PendingActionButtonsProps) => {
  const { t } = useTranslation();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<null | { type: "approve" | "reject" | "submit"; reason?: string }> (null);

  if (status !== "PENDING" && status !== "FORWARDED") {
    return null;
  }

  // If approver cannot approve (e.g., SHO/SO for > 3 days leave), show only Forward
  if (!canApprove) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            console.log('[PendingActionButtons] Forward button clicked');
            if (onForward) onForward();
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] text-white rounded-lg text-xs font-semibold hover:shadow-md transition shadow-sm"
        >
          <Forward size={14} />
          {t("forward")}
        </button>
      </div>
    );
  }

  const handleApprove = () => {
    setSuccessMessage(t("leaveApprovedSuccessfully") || "Leave approved successfully!");
    setPendingAction({ type: "approve" });
    setShowSuccessModal(true);
  };

  const handleReject = () => {
    setShowRejectModal(true);
    setRejectReason("");
    setError("");
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      setError("Reason is required");
      return;
    }
    setShowRejectModal(false);
    setSuccessMessage(t("leaveRejectedSuccessfully") || "Leave rejected successfully!");
    setPendingAction({ type: "reject", reason: rejectReason });
    setShowSuccessModal(true);
    setRejectReason("");
    setError("");
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setError("");
  };

  const handleSuccessConfirm = () => {
    if (pendingAction) {
      if (pendingAction.type === "approve") {
        onApprove();
      } else if (pendingAction.type === "reject") {
        onReject(pendingAction.reason);
      } else if (pendingAction.type === "submit") {
        onForward && onForward();
      }
    }
    setShowSuccessModal(false);
    setPendingAction(null);
    setSuccessMessage("");
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleApprove}
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#138808] to-[#1b9e10] text-white rounded-lg text-xs font-semibold hover:shadow-md transition shadow-sm"
        >
          <Check size={14} />
        </button>
        <button
          onClick={handleReject}
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#c62828] to-[#d84315] text-white rounded-lg text-xs font-semibold hover:shadow-md transition shadow-sm"
        >
          <X size={14} />
        </button>
      </div>
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col gap-3">
            <h3 className="font-semibold text-lg mb-2">{t("provideRejectionReason") || "Provide Rejection Reason"}</h3>
            <textarea
              className="border rounded p-2 w-full min-h-[60px]"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder={t("enterReason") || "Enter reason..."}
              autoFocus
            />
            {error && <div className="text-red-600 text-xs">{error}</div>}
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={handleRejectCancel}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-3 py-1 rounded bg-[#c62828] hover:bg-[#b71c1c] text-white font-semibold"
              >
                {t("submit") || "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col gap-3 items-center">
            <h3 className="font-semibold text-lg mb-2 text-green-700">{successMessage}</h3>
            <button
              onClick={handleSuccessConfirm}
              className="px-4 py-2 rounded bg-[#138808] hover:bg-[#0d6b06] text-white font-semibold mt-2"
            >
              {t("ok") || "OK"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingActionButtons;