const Class = require("../models/Class");

// FR-3: Create a new Class
exports.createClass = async (req, res) => {
  const { className, classCode, teacherId, description } = req.body;

  try {
    // Check if class code already exists (Prevent Duplicates)
    const existingClass = await Class.findOne({ classCode });
    if (existingClass) {
      return res.status(400).json({ message: "Class code already exists" });
    }

    const newClass = new Class({
      className,
      classCode,
      teacherId,
      description
    });

    await newClass.save();
    res.status(201).json({ message: "Class created successfully", class: newClass });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// FR-3: Update Class Details
exports.updateClass = async (req, res) => {
  const { classId } = req.params;
  const updates = req.body;

  try {
    // Find class by ID and update it
    // { new: true } returns the updated document
    // { runValidators: true } ensures updates follow Schema rules
    const updatedClass = await Class.findByIdAndUpdate(
      classId, 
      updates, 
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ message: "Class updated successfully", class: updatedClass });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NEW: Get All Classes (Required for Student Dashboard)
exports.getAllClasses = async (req, res) => {
  try {
    // Fetch all classes and sort by newest created first
    const classes = await Class.find().sort({ createdAt: -1 });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch classes" });
  }
};