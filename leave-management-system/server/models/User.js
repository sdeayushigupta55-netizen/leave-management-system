const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  pno: { type: String, required: true, unique: true },
  contact: { type: String, required: true },   
  area: { type: String},
  role: { type: String, required: true},
  rank: { type: String, required: true },
  policeStation: { type: String },
  circleOffice: { type: String },
  gender: { type: String },
  beatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BeatBook',
    // Only allow beatId if rank is Constable or Head Constable
    validate: {
      validator: function(value) {
        if (!value) return true; // allow null for other ranks
        return this.rank === 'CONSTABLE' || this.rank === 'HEADCONSTABLE';
      },
      message: props => `Only Constable or Head Constable can have a beatId`
    }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  // Add more fields as needed
});

module.exports = mongoose.model('User', UserSchema);