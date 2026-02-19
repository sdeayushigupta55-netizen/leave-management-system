const mongoose = require("mongoose");

const populationSchema = new mongoose.Schema({
  beatId: { type: mongoose.Schema.Types.ObjectId, ref: "BeatBook", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add this line
  villageName: String,
  totalPopulation: Number,
  male: Number,
  female: Number,
  category: { type: String, enum: ["Sensitive", "Normal"] },
}, { timestamps: true });

module.exports = mongoose.model("PopulationDetails", populationSchema);