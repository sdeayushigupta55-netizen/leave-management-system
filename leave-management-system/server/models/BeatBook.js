const mongoose = require("mongoose");

const beatBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // unique reference to User
  beatNo: { type: String },
  villages: String,
  villageLatLong: String,
  beatIncharge: String,
  beatInchargeMobile: String,
  alternateBeatConstableName: String,
  alternateBeatConstableMobile: String,
  // ...other beat-specific fields
}, { timestamps: true });

module.exports = mongoose.model("BeatBook", beatBookSchema);