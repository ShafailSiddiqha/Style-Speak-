const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const ChatSchema = new mongoose.Schema(
  {
    personName: {
      type: String,
      required: true
    },
    personaSummary: {
      type: String,
      default: ""
    },
    messages: [MessageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
