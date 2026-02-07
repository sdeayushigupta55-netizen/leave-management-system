/**
 * Leave Approval PDF Generator
 * 
 * Generates a professional PDF certificate for approved leaves.
 */

import { jsPDF } from "jspdf";
import type { Leave } from "../type/leave";

// Government colors
const COLORS = {
  navyBlue: [26, 35, 126] as [number, number, number],    // #1a237e
  gold: [197, 162, 0] as [number, number, number],         // #c5a200
  green: [19, 136, 8] as [number, number, number],         // #138808
  black: [0, 0, 0] as [number, number, number],
  gray: [100, 100, 100] as [number, number, number],
  lightGray: [245, 245, 245] as [number, number, number],
};

const leaveTypeLabels: Record<string, string> = {
  CASUAL: "Casual Leave",
  SICK: "Sick Leave",
  EARNED: "Earned Leave",
  EMERGENCY: "Emergency Leave",
  CHILD_CARE: "Child Care Leave",
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
 * Generate Leave Approval PDF
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
  
  // Outer border
  doc.setDrawColor(...COLORS.navyBlue);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
  // Inner decorative border
  doc.setLineWidth(0.5);
  doc.setDrawColor(...COLORS.gold);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  yPos = 25;

  // Government Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.navyBlue);
  doc.text("GOVERNMENT OF UTTAR PRADESH", pageWidth / 2, yPos, { align: "center" });

  yPos += 8;
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.navyBlue);
  doc.text("POLICE DEPARTMENT", pageWidth / 2, yPos, { align: "center" });

  // Divider line
  yPos += 8;
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(1);
  doc.line(margin + 20, yPos, pageWidth - margin - 20, yPos);

  // ========================
  // Title
  // ========================
  yPos += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.green);
  doc.text("LEAVE APPROVAL CERTIFICATE", pageWidth / 2, yPos, { align: "center" });

  // ========================
  // Reference Number
  // ========================
  yPos += 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.gray);
  doc.text(`Reference No: LAC/${leave.id.slice(0, 8).toUpperCase()}`, margin, yPos);
  doc.text(`Date: ${formatDate(new Date().toISOString())}`, pageWidth - margin, yPos, { align: "right" });

  // ========================
  // Applicant Details Section
  // ========================
  yPos += 15;
  
  // Section Header
  doc.setFillColor(...COLORS.navyBlue);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("APPLICANT DETAILS", margin + 3, yPos + 5.5);

  yPos += 12;
  
  // Details table
  const addDetailRow = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.navyBlue);
    doc.text(label, margin, yPos);
    doc.text(":", margin + 55, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.black);
    doc.text(value, margin + 60, yPos);
    yPos += 7;
  };

  addDetailRow("Name", leave.name);
  addDetailRow("Rank", leave.applicantRank);
  addDetailRow("Police Station", leave.policeStation || "-");
  if (leave.circleOffice) {
    addDetailRow("Circle Office", leave.circleOffice);
  }

  // ========================
  // Leave Details Section
  // ========================
  yPos += 5;
  
  // Section Header
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
  
  // Reason with word wrap
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.navyBlue);
  doc.text("Reason", margin, yPos);
  doc.text(":", margin + 55, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.black);
  const reasonLines = doc.splitTextToSize(leave.reason, pageWidth - margin - 65);
  doc.text(reasonLines, margin + 60, yPos);
  yPos += Math.max(7, reasonLines.length * 5);

  // ========================
  // Approval Details Section
  // ========================
  yPos += 5;
  
  // Section Header
  doc.setFillColor(...COLORS.green);
  doc.rect(margin, yPos, pageWidth - margin * 2, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("APPROVAL DETAILS", margin + 3, yPos + 5.5);

  yPos += 12;

  // Find approval action
  const approvalAction = leave.approvals.find((a) => a.action === "APPROVED");
  
  if (approvalAction) {
    addDetailRow("Approved By", approvalAction.approverRank);
    addDetailRow("Approval Date", formatDate(approvalAction.timestamp));
  }

  // Status badge
  yPos += 5;
  doc.setFillColor(...COLORS.green);
  doc.roundedRect(pageWidth / 2 - 25, yPos, 50, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("APPROVED", pageWidth / 2, yPos + 7, { align: "center" });

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

  // Signature line
  doc.setDrawColor(...COLORS.black);
  doc.setLineWidth(0.3);
  doc.line(pageWidth - margin - 60, footerY, pageWidth - margin, footerY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.text("Authorized Signature", pageWidth - margin - 30, footerY + 5, { align: "center" });

  // Footer text
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.text("This is a computer-generated document.", pageWidth / 2, pageHeight - 18, { align: "center" });

  // ========================
  // Save PDF
  // ========================
  const fileName = `Leave_Approval_${leave.name.replace(/\s+/g, "_")}_${leave.id.slice(0, 8)}.pdf`;
  doc.save(fileName);
};
