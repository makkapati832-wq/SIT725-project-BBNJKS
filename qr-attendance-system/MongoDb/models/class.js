const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  classCode: { type: String, required: true, unique: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Class", classSchema);
