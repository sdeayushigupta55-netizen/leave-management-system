/**
 * Leave Approval PDF Generator
 * 
 * Generates a professional PDF certificate for approved and rejected leaves.
 */

import { jsPDF } from "jspdf";
import type { Leave } from "../type/leave";

// Government colors
const COLORS = {
  navyBlue: [26, 35, 126] as [number, number, number],    // #1a237e
  gold: [197, 162, 0] as [number, number, number],         // #c5a200
  green: [19, 136, 8] as [number, number, number],         // #138808
  red: [211, 47, 47] as [number, number, number],          // #d32f2f
  gray: [100, 100, 100] as [number, number, number],
  lightGray: [245, 245, 245] as [number, number, number],
};

const leaveTypeLabels: Record<string, string> = {
  CASUAL: "Casual Leave",
  SICK: "Sick Leave",
  EARNED: "Earned Leave",
  EMERGENCY: "Emergency Leave",
  CHILD_CARE: "Child Care Leave",
  MEDICAL: "Medical Leave",
  PATERNITY: "Paternity Leave",
  MATERNITY: "Maternity Leave",
  OPTIONAL: "Optional Leave",
};

/**
 * Format date for PDF
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/**
 * Generate Leave Approval PDF (handles both approved and rejected)
 */
export const generateLeaveApprovalPDF = (leave: Leave): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // ========================
  // Header with Border
  // ========================
  doc.setDrawColor(...COLORS.navyBlue);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setLineWidth(0.5);
  doc.setDrawColor(...COLORS.gold);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  yPos = 25;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.navyBlue);
  doc.text("GOVERNMENT OF UTTAR PRADESH", pageWidth / 2, yPos, { align: "center" });

  yPos += 8;
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.navyBlue);
  doc.text("POLICE DEPARTMENT", pageWidth / 2, yPos, { align: "center" });

  yPos += 8;
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(1);
  doc.line(margin + 20, yPos, pageWidth - margin - 20, yPos);

  yPos += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(
    ...(leave.status === "APPROVED" ? COLORS.green : COLORS.red)
  );
  doc.text(
    leave.status === "APPROVED"
      ? "LEAVE APPROVAL CERTIFICATE"
      : "LEAVE REJECTION CERTIFICATE",
    pageWidth / 2,
    yPos,
    { align: "center" }
  );

  yPos += 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.gray);
  doc.text(`Reference No: LAC/${leave.id.slice(0, 8).toUpperCase()}`, margin, yPos);
  doc.text(`Date: ${formatDate(new Date().toISOString())}`, pageWidth - margin, yPos, { align: "right" });

  yPos += 15;
  doc.setFillColor(...COLORS.navyBlue);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("APPLICANT DETAILS", margin + 3, yPos + 5.5);

  yPos += 12;

  function addDetailRow(label: string, value: string) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.navyBlue);
    doc.text(label, margin, yPos);
    doc.text(":", margin + 55, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.red);
    doc.text(value, margin + 60, yPos);
    yPos += 7;
  }

  addDetailRow("Name", leave.name);
  addDetailRow("Rank", leave.applicantRank);
  addDetailRow("Police Station", leave.policeStation || "-");
  if (leave.circleOffice) {
    addDetailRow("Circle Office", leave.circleOffice);
  }

  yPos += 5;
  doc.setFillColor(...COLORS.navyBlue);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("LEAVE DETAILS", margin + 3, yPos + 5.5);

  yPos += 12;

  const leaveTypeLabel = leaveTypeLabels[leave.leaveType] || leave.leaveType;
  addDetailRow("Leave Type", leaveTypeLabel);
  addDetailRow("From Date", formatDate(leave.from));
  addDetailRow("To Date", formatDate(leave.to));
  addDetailRow("Number of Days", `${leave.numberOfDays} days`);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.navyBlue);
  doc.text("Reason", margin, yPos);
  doc.text(":", margin + 55, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.red);
  const reasonLines = doc.splitTextToSize(leave.reason, pageWidth - margin - 65);
  doc.text(reasonLines, margin + 60, yPos);
  yPos += Math.max(7, reasonLines.length * 5);

  // ========================
  // Approval/Rejection Details Section
  // ========================
  yPos += 5;
  doc.setFillColor(
    ...(leave.status === "APPROVED" ? COLORS.green : COLORS.navyBlue)
  );
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(
    leave.status === "APPROVED" ? "APPROVAL DETAILS" : "REJECTION DETAILS",
    margin + 3,
    yPos + 5.5
  );

  yPos += 12;

  if (leave.status === "APPROVED") {
    const approvalAction = leave.approvals.find((a) => a.action === "APPROVED");
    if (approvalAction) {
      addDetailRow("Approved By", approvalAction.approverRank);
      addDetailRow("Approval Date", formatDate(approvalAction.timestamp));
    }
    yPos += 5;
    doc.setFillColor(...COLORS.green);
    doc.roundedRect(pageWidth / 2 - 25, yPos, 50, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("APPROVED", pageWidth / 2, yPos + 7, { align: "center" });
  } else if (leave.status === "REJECTED") {

    const rejectionAction = [...leave.approvals].reverse().find((a) => a.action === "REJECTED");
    if (rejectionAction) {
      addDetailRow("Rejected By", `${rejectionAction.approverRank} (${rejectionAction.approverName})`);
      addDetailRow("Rejection Date", formatDate(rejectionAction.timestamp));
      addDetailRow("Rejection Reason", rejectionAction.reason || "N/A");
    }
    yPos += 5;
    doc.setFillColor(...COLORS.red);
    doc.roundedRect(pageWidth / 2 - 25, yPos, 50, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("REJECTED", pageWidth / 2, yPos + 7, { align: "center" });
  }

  // ========================
  // Forward History (if any)
  // ========================
  if (leave.forwardHistory && leave.forwardHistory.length > 0) {
    yPos += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.navyBlue);
    doc.text("Approval Chain:", margin, yPos);

    yPos += 6;
    leave.forwardHistory.forEach((fh, idx) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.gray);
      doc.text(`${idx + 1}. ${fh.fromRank || "Initial"} -> ${fh.toRank} (${formatDate(fh.forwardedAt)})`, margin + 5, yPos);
      yPos += 5;
    });
  }

  // ========================
  // Footer
  // ========================
  const footerY = pageHeight - 30;
  doc.setDrawColor(...COLORS.red);
  doc.setLineWidth(0.3);
  doc.line(pageWidth - margin - 60, footerY, pageWidth - margin, footerY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.text("Authorized Signature", pageWidth - margin - 30, footerY + 5, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.text("This is a computer-generated document.", pageWidth / 2, pageHeight - 18, { align: "center" });

  // ========================
  // Save PDF
  // ========================
  const fileName = `Leave_${leave.status}_${leave.name.replace(/\s+/g, "_")}_${leave.id.slice(0, 8)}.pdf`;
  doc.save(fileName);
};