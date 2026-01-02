const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// 🔹 MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/style_speak")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// 🔹 Schema
const ChatSchema = new mongoose.Schema({
  name: String,
  filename: String,
  content: String,
});

const Chat = mongoose.model("Chat", ChatSchema);

// ==========================
// 1️⃣ Upload WhatsApp Chat
// ==========================
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const name = req.body.name;
    const file = req.file;

    const chatText = fs.readFileSync(file.path, "utf8");

    const chat = new Chat({
      name,
      filename: file.originalname,
      content: chatText,
    });

    await chat.save();

    res.json({ message: "Chat content saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// 2️⃣ Get Chats List
// ==========================
app.get("/chats", async (req, res) => {
  const chats = await Chat.find().sort({ _id: -1 });
  res.json(chats);
});

// ==========================
// 3️⃣ TALK TO AI (WITH STYLE)
// ==========================
app.post("/ai-reply", async (req, res) => {
  try {
    const { message, chatId, conversation } = req.body;

    if (!chatId) {
      return res.status(400).json({ reply: "No chat selected" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ reply: "Chat not found" });
    }

    const response = await axios.post("http://127.0.0.1:5001/generate", {
      chatContent: chat.content,
      userMessage: message,
      conversation: conversation || [],
    });

    res.json({ reply: response.data.reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI error" });
  }
});



// ==========================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
