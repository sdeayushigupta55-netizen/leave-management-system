import mongoose from "mongoose";
import PopulationDetails from '../models/PopulationDetails.js';
import Religion from '../models/religionSchema.js';
import SubCaste from '../models/subCasteSchema.js';

export async function getAllPopulationDetails(req, res) {
  try {
    const details = await PopulationDetails.find()
      .populate('religions.religionId', 'name')
      .populate('religions.subCastes.subCasteId', 'name');
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createPopulationDetails(req, res) {
  try {
    req.body.beatId = new mongoose.Types.ObjectId(req.body.beatId);

    // Fetch all religions and subcastes for name lookup
    const religionsList = await Religion.find();
    const subCastesList = await SubCaste.find();

    req.body.religions = req.body.religions.map(r => ({
      ...r,
      religionId: new mongoose.Types.ObjectId(r.religionId),
      religionName: religionsList.find(rel => String(rel._id) === String(r.religionId))?.name || "",
      subCastes: r.subCastes.map(sc => ({
        ...sc,
        subCasteId: new mongoose.Types.ObjectId(sc.subCasteId),
        subCasteName: subCastesList.find(sub => String(sub._id) === String(sc.subCasteId))?.name || ""
      }))
    }));

    console.log("Received body:", req.body);
    const details = new PopulationDetails(req.body);
    await details.save();
    res.status(201).json(details);
  } catch (err) {
    console.error("PopulationDetails save error:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}

export async function updatePopulationDetails(req, res) {
  try {
    const updated = await PopulationDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('religions.religionId', 'name')
      .populate('religions.subCastes.subCasteId', 'name');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAllReligions(req, res) {
  try {
    const religions = await Religion.find();
    res.json(religions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAllSubCastes(req, res) {
  try {
    const subCastes = await SubCaste.find();
    res.json(subCastes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// exports.deletePopulationDetails = async (req, res) => {
//   try {
//     await PopulationDetails.findOneAndDelete({ _id: req.params.id });
//     res.status(204).end();
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };