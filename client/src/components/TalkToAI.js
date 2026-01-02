import { useState } from "react";

function TalkToAI({ selectedChat }) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  if (!selectedChat) {
    return <p>🌸 Select a chat from “My Chats” first</p>;
  }

  const askAI = async () => {
    if (!message.trim()) return;

    const res = await fetch("http://localhost:5000/ai-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        chatId: selectedChat._id,
        conversation,
      }),
    });

    const data = await res.json();

    setConversation([
      ...conversation,
      { role: "user", text: message },
      { role: "ai", text: data.reply },
    ]);

    setMessage("");
  };

  return (
    <div>
      <h3>Talking as 🌸 {selectedChat.name}</h3>

      <div className="chat-box">
        {conversation.map((c, i) => (
          <div key={i} className={`bubble ${c.role}`}>
            {c.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <textarea
          rows="2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type something sweet..."
        />
        <button onClick={askAI}>Send</button>
      </div>
    </div>
  );
}

export default TalkToAI;
