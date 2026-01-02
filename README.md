# 🌸 StyleSpeak — Persona-Based Conversational AI

StyleSpeak is a full-stack AI application that mimics a person’s texting style
using their WhatsApp chat history.

## ✨ Features
- Upload WhatsApp chat exports
- Automatically learn texting style (formal, casual, emoji usage)
- AI replies in the same style using LLMs
- Supports multiple personas
- Clean, aesthetic UI
- Conversation memory

## 🛠 Tech Stack
- React (Frontend)
- Node.js + Express (Backend)
- MongoDB (Chat storage)
- Python Flask (NLP Service)
- OpenAI API (Response generation)

## 🧠 How It Works
1. User uploads chat history
2. System analyzes linguistic patterns
3. LLM generates a response
4. Response is rewritten to match the person’s style

## ⚠️ Notes
- API keys are stored securely in environment variables
- `.env` is excluded from version control
