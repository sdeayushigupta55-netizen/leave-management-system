const mongoose = require("mongoose");

const subCasteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  religionId: { type: mongoose.Schema.Types.ObjectId, ref: "Religion", required: true }
});

module.exports = mongoose.model("SubCaste", subCasteSchema);