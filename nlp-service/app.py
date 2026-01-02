from flask import Flask, request, jsonify
from flask_cors import CORS
import os, re
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI()

# --------------------------------
# 1️⃣ FREQUENCY-BASED STYLE ANALYSIS
# --------------------------------
def analyze_style(chat_text):
    lines = [l.strip().lower() for l in chat_text.splitlines() if l.strip()]
    total = len(lines)

    if total == 0:
        return {}

    bro_count = sum(1 for l in lines if "bro" in l)
    yaar_count = sum(1 for l in lines if "yaar" in l)
    haan_count = sum(1 for l in lines if "haan" in l)
    emoji_count = sum(1 for l in lines if re.search(r"[😂😄😅🤣😊]", l))

    avg_length = sum(len(l.split()) for l in lines) / total

    return {
        "use_bro": bro_count / total > 0.10,      # >10% messages
        "use_yaar": yaar_count / total > 0.10,
        "use_haan": haan_count / total > 0.10,
        "use_emoji": emoji_count / total > 0.15,
        "formal": avg_length > 8                  # longer sentences → formal
    }

# --------------------------------
# 2️⃣ OPENAI THINKING BRAIN
# --------------------------------
def get_smart_reply(user_message, conversation):
    messages = [
        {
            "role": "system",
            "content": (
                "You are replying as a human in a WhatsApp chat. "
                "Reply naturally and appropriately. "
                "Keep replies short unless needed."
            )
        }
    ]

    for c in conversation[-4:]:
        role = "assistant" if c["role"] == "ai" else "user"
        messages.append({"role": role, "content": c["text"]})

    messages.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.6,
        max_tokens=60
    )

    return response.choices[0].message.content.strip()

# --------------------------------
# 3️⃣ APPLY STYLE SMARTLY
# --------------------------------
def apply_style(reply, style):
    text = reply

    if style.get("use_haan"):
        text = text.replace("yes", "haan")

    if style.get("use_bro"):
        text = "bro " + text

    if style.get("use_yaar"):
        text += " yaar"

    if style.get("use_emoji"):
        text += " 😄"

    # If formal, remove slang completely
    if style.get("formal"):
        text = text.replace("bro ", "")
        text = text.replace(" yaar", "")
        text = text.replace(" 😄", "")

    return text

# --------------------------------
# 4️⃣ MAIN ENDPOINT
# --------------------------------
@app.route("/generate", methods=["POST"])
def generate():
    data = request.json or {}

    chat_content = data.get("chatContent", "")
    user_message = data.get("userMessage", "")
    conversation = data.get("conversation", [])

    style = analyze_style(chat_content)
    smart_reply = get_smart_reply(user_message, conversation)
    final_reply = apply_style(smart_reply, style)

    return jsonify({"reply": final_reply})

if __name__ == "__main__":
    print("🔥 NLP SERVICE RUNNING (SMART GENERIC STYLE)")
    app.run(port=5001)
