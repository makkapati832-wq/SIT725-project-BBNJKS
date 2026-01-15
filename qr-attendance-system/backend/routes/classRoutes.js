const express = require("express");
const router = express.Router();

// Import the controller functions (Make sure getAllClasses is included here)
const { createClass, updateClass, getAllClasses } = require("../controllers/classController");

// FR-3: Create a new Class
router.post("/", createClass);

// FR-3: Update an existing Class
router.put("/:classId", updateClass);

// NEW: Get all Classes (For Student Dashboard)
router.get("/", getAllClasses);

module.exports = router;