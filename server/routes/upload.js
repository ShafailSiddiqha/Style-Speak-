const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Chat = require("../models/Chat");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload WhatsApp chat
router.post("/upload", upload.single("chatFile"), async (req, res) => {
  try {
    const { personName } = req.body;

    if (!personName || !req.file) {
      return res.status(400).json({ error: "Missing name or file" });
    }

    const rawText = fs.readFileSync(req.file.path, "utf-8");

    // Very basic parsing (we will improve later)
    const messages = rawText
      .split("\n")
      .filter(Boolean)
      .map(line => ({
        role: "user",
        content: line
      }));

    const chat = await Chat.create({
      personName,
      personaSummary: `Texting style of ${personName}`,
      messages
    });

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      chatId: chat._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
