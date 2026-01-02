import { useEffect, useState } from "react";

function MyChats({ setSelectedChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/chats")
      .then((res) => res.json())
      .then((data) => setChats(data));
  }, []);

  return (
    <div>
      <h3>🌸 My Chats</h3>

      {chats.map((chat) => (
        <div
          key={chat._id}
          className="card"
          onClick={() => {
            setSelectedChat(chat);
            alert(`Selected ${chat.name}`);
          }}
        >
          <b>{chat.name}</b>
          <div style={{ fontSize: "12px", opacity: 0.7 }}>
            {chat.filename}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyChats;
