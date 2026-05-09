require("dotenv").config({ path: __dirname + "/../.env" });

// const mongoose = require("mongoose");
// const User = require("../models/User");
// const BeatBook = require("../models/BeatBook");

// async function assignBeatIds() {
//   await mongoose.connect(process.env.MONGODB_URI);

//   const users = await User.find();
//   for (const user of users) {
//     if (["CONSTABLE", "HEADCONSTABLE"].includes(user.rank)) {
//       let beatBook = await BeatBook.findOne({ userId: user._id });
//       if (!beatBook) {
//         // Do NOT set beatNo here; let user add it later via frontend
//         beatBook = await BeatBook.create({ userId: user._id });
//       }
//       user.beatId = beatBook._id;
//       await user.save();
//     }
//   }

//   console.log("✅ BeatBooks created for all users (without beatNo)");
//   mongoose.disconnect();
// }

// assignBeatIds();

// require("dotenv").config({ path: __dirname + "/../.env" });
// const mongoose = require("mongoose");
// const BeatBook = require("../models/BeatBook");

// async function removeBeatNo() {
//   await mongoose.connect(process.env.MONGODB_URI);

//   const result = await BeatBook.updateMany({}, { $unset: { beatNo: "" } });
//   console.log(`✅ Removed beatNo from ${result.modifiedCount} BeatBook documents`);

//   mongoose.disconnect();
// }

// removeBeatNo();
const mongoose = require("mongoose");

const Religion = require("../models/religionSchema");
const SubCaste = require("../models/subCasteSchema");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/leave-management";

async function seed() {
  await mongoose.connect(MONGODB_URI);

  // Clear existing data (optional)
  await Religion.deleteMany({});
  await SubCaste.deleteMany({});

  // Insert religions
  const religions = await Religion.insertMany([
    { name: "हिन्दू" },
    { name: "मुस्लिम" },
    { name: "अन्य" }
  ]);

  // Insert subcastes with correct religionId references
  const subCastes = [
    { name: "ब्राह्मण", religionId: religions[0]._id },
    { name: "यादव", religionId: religions[0]._id },
    { name: "शेख", religionId: religions[1]._id },
    { name: "सैयद", religionId: religions[1]._id },
    { name: "अन्य", religionId: religions[2]._id }
  ];
  await SubCaste.insertMany(subCastes);

  console.log("✅ Master data seeded!");
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
});