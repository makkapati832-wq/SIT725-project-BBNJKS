const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  qrToken: { type: String, required: true, unique: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Session", sessionSchema);
