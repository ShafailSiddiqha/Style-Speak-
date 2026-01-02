import { useState } from "react";
import ChatUpload from "./components/ChatUpload";
import MyChats from "./components/MyChats";
import TalkToAI from "./components/TalkToAI";
import "./App.css";

function App() {
  const [page, setPage] = useState("upload");
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="app-container">
      <div className="app-header">🌸 StyleSpeak</div>

      <div className="nav-bar">
        <button onClick={() => setPage("upload")}>Upload Chat</button>
        <button onClick={() => setPage("chats")}>My Chats</button>
        <button onClick={() => setPage("ai")}>Talk to AI</button>
      </div>

      {page === "upload" && <ChatUpload />}
      {page === "chats" && <MyChats setSelectedChat={setSelectedChat} />}
      {page === "ai" && <TalkToAI selectedChat={selectedChat} />}
    </div>
  );
}

export default App;
