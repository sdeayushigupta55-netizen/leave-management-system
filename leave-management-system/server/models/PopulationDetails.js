const mongoose = require("mongoose");

const PopulationDetailsSchema = new mongoose.Schema({
  beatId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "BeatBook" },
  villageName: { type: String, required: true },
  totalPopulation: { type: Number, required: true },
  religions: [
    {
      religionId: { type: mongoose.Schema.Types.ObjectId, ref: "Religion", required: true },
      religionName: { type: String },
      subCastes: [
        {
          subCasteId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCaste", required: true },
          subCasteName: { type: String },
          population: { type: Number, required: true }
        }
      ]
    }
  ]
});

module.exports = mongoose.model("PopulationDetails", PopulationDetailsSchema);