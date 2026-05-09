const mongoose = require("mongoose");
const { villageSchema } = require("./populations");

const beatBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  beatNo: { type: String },
  villages: [villageSchema], // Embedded array of villages
  beatIncharge: String,
  beatInchargeMobile: String,
  alternateBeatConstableName: String,
  alternateBeatConstableMobile: String,
}, { timestamps: true });

module.exports = mongoose.model("BeatBook", beatBookSchema);