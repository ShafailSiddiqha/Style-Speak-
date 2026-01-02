import React, { useState } from "react";

function ChatUpload() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!name || !file) {
      alert("Please enter name and select file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert("Server not responding");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload WhatsApp Chat</h2>

      <input
        placeholder="Person Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br /><br />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default ChatUpload;
