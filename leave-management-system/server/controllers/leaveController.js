const Leave = require('../models/Leave');

exports.getAllLeaves = async (req, res) => {
  const leaves = await Leave.find();
  res.json(leaves);
};

exports.createLeave = async (req, res) => {
  const leave = new Leave(req.body);
  await leave.save();
  res.status(201).json(leave);
};

exports.updateLeave = async (req, res) => {
  const leave = await Leave.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(leave);
};

exports.deleteLeave = async (req, res) => {
  await Leave.findOneAndDelete({ id: req.params.id });
  res.status(204).end();
};