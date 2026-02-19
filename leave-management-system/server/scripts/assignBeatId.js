// require("dotenv").config({ path: __dirname + "/../.env" });

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

require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const BeatBook = require("../models/BeatBook");

async function removeBeatNo() {
  await mongoose.connect(process.env.MONGODB_URI);

  const result = await BeatBook.updateMany({}, { $unset: { beatNo: "" } });
  console.log(`✅ Removed beatNo from ${result.modifiedCount} BeatBook documents`);

  mongoose.disconnect();
}

removeBeatNo();