const mongoose = require("mongoose");

const villageSubCastePopulationSchema = new mongoose.Schema({
  subCasteId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCaste", required: true },
  population: { type: Number, required: true }
}, { _id: false });

const villageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: String },
  longitude: { type: String },
  casteData: [villageSubCastePopulationSchema]
}, { _id: false });

module.exports = { villageSchema, villageSubCastePopulationSchema };