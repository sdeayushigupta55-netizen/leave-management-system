const PopulationDetails = require('../models/PopulationDetails');

exports.getAllPopulationDetails = async (req, res) => {
  try {
    const details = await PopulationDetails.find();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPopulationDetails = async (req, res) => {
  try {
    const details = new PopulationDetails(req.body);
    await details.save();
    res.status(201).json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePopulationDetails = async (req, res) => {
  try {
    const details = await PopulationDetails.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.deletePopulationDetails = async (req, res) => {
//   try {
//     await PopulationDetails.findOneAndDelete({ _id: req.params.id });
//     res.status(204).end();
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };