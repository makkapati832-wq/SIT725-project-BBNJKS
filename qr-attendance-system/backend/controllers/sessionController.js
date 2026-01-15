const Session = require("../models/Session");
const QRCode = require("qrcode");

// Create new session & generate QR (FR-3)
exports.createSession = async (req, res) => {
  const { sessionName, createdBy } = req.body;

  try {
    const newSession = new Session({
      sessionName,
      createdBy
    });

    // Generate QR data
    // The format "SESSION:ID" matches what the Frontend Scanner expects
    const qrData = `SESSION:${newSession._id}`;
    const qrImage = await QRCode.toDataURL(qrData);

    newSession.qrCode = qrImage;
    await newSession.save();

    res.status(201).json({
      message: "Session created",
      session: newSession
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sessions
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Validate QR Code (FR-5)
exports.validateQR = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ valid: false, message: "Invalid Session ID" });
    }

    if (!session.isActive) {
      return res.status(400).json({ valid: false, message: "Session is inactive" });
    }

    res.status(200).json({ 
      valid: true, 
      message: "QR Code is valid", 
      session 
    });
  } catch (error) {
    res.status(500).json({ error: "Invalid QR Format or Server Error" });
  }
};