const User = require('../models/User');
const BeatBook = require('../models/BeatBook');
// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {

  try {
    const user = new User(req.body);
    if (["CONSTABLE", "HEADCONSTABLE"].includes(user.rank)) {
      const beatBook = await BeatBook.create({ userId: user._id });
      user.beatId = beatBook._id;
    }
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Error in createUser:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    // Only allow specific fields to be updated (optional, but recommended)
    const allowedFields = [
      "name", "contact", "role", "rank", "circleOffice", "policeStation",
      "area", "gender", "isActive", "password", "profilPic"
    ];
    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData, // use filtered data
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error("Error in updateUser:", err); // Log the error
    res.status(500).json({ error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};