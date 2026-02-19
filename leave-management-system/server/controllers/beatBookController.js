
// Delete a beat book entry
// exports.deleteBeatBook = async (req, res) => {
//   try {
//     const beatBook = await BeatBook.findByIdAndDelete(req.params.id);
//     if (!beatBook) return res.status(404).json({ error: 'Beat Book entry not found' });
//     res.json({ message: 'Beat Book entry deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// import BeatBook from "../models/BeatBook.js";
const BeatBook = require('../models/BeatBook');
// Get all beat book entries
// ...existing code...
exports.getBeatBookById = async (req, res) => {
  try {
    const beatBook = await BeatBook.findById(req.params.id);
    if (!beatBook) return res.status(404).json({ message: 'BeatBook not found' });
    res.json(beatBook);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// ...existing code...
exports.getAllBeatBooks = async (req, res) => {
  try {
    const beatBooks = await BeatBook.find();
    res.json(beatBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Create a new beat book entry
exports.createBeatBook = async (req, res) => {
  try {
       
    const beatBook = new BeatBook(req.body);
    await beatBook.save();
    res.status(201).json(beatBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a beat book entry
exports.updateBeatBook = async (req, res) => {
  try {

    const beatBook = await BeatBook.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!beatBook) return res.status(404).json({ error: 'Beat Book entry not found' });
    res.json(beatBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

