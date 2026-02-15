const mongoose = require('mongoose');

const ApprovalSchema = new mongoose.Schema({
  approverId: String,
  approverRank: String,
  approverName: String,
  action: String, // 'APPROVED', 'REJECTED', 'FORWARDED'
  timestamp: String,
  reason: String,
}, { _id: false });

const ForwardHistorySchema = new mongoose.Schema({
  fromRank: String,
  toRank: String,
  forwardedAt: String,
  reason: String,
}, { _id: false });

const LeaveSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // UUID
  applicantId: { type: String, required: true },
  applicantRank: { type: String, required: true },
  name: { type: String, required: true },
  policeStation: { type: String },
  circleOffice: { type: String },
  gender: { type: String },
  leaveType: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  reason: { type: String, required: true },
  numberOfDays: { type: Number, required: true },
  status: { type: String, required: true }, // 'PENDING', 'APPROVED', etc.
  approvalChain: [String],
  approvals: [ApprovalSchema],
  currentApproverId: String,
  currentApproverName: String,
  currentApproverRank: String,
  submittedOn: String,
  forwardHistory: [ForwardHistorySchema],
  attachment: String,
  lastUpdatedOn: String,
  lastForwardedAt: String,
});

module.exports = mongoose.model('Leave', LeaveSchema);