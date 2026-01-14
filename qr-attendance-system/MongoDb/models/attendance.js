const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["present"], default: "present" }
});

attendanceSchema.index({ session: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
