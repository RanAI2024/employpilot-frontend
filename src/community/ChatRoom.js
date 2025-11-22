import React, { useEffect, useRef, useState } from "react";
import { db, auth } from "../firebase";
import { ref, push, onValue } from "firebase/database";
import "./community.css";
import axios from "axios";

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const apiBase = process.env.REACT_APP_API_URL;

  // Auto-scroll always to last message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Live listener
  useEffect(() => {
    const chatRef = ref(db, "community_chat/");
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.values(data).sort(
          (a, b) => a.timestamp - b.timestamp
        );
        setMessages(entries);
      }
    });
    return () => unsubscribe();
  }, []);

  // Send message
  const sendMessage = async () => {
    const user = auth.currentUser;
    if (!user || input.trim() === "") return;

    const chatRef = ref(db, "community_chat/");

    const msg = input.trim();
    setInput("");

    // Store the user's message
    await push(chatRef, {
      text: msg,
      user: user.email,
      uid: user.uid,
      timestamp: Date.now(),
      isAI: false,
    });

    scrollToBottom();

    // Trigger AI response
    try {
      const res = await axios.post(`${apiBase}/api/ai-reply`, {
        message: msg,
      });

      const aiText = res.data.reply || "I'm here to help!";

      await push(chatRef, {
        text: aiText,
        user: "EmployPilot AI",
        uid: "ai_bot",
        timestamp: Date.now(),
        isAI: true,
      });
    } catch (err) {
      console.error("AI error:", err);
    }
  };

  return (
    <div className="chat-wrapper">
      <h2 className="chat-title">💬 EmployPilot Live Chatroom</h2>
      <p className="chat-sub">Connect, ask questions, and get instant career help.</p>

      {/* Chat Window */}
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.isAI ? "ai-bubble" : "user-bubble"}
          >
            <p className="bubble-text">{msg.text}</p>
            <span className="bubble-meta">
              {msg.user} •{" "}
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="chat-input-bar">
        <input
          type="text"
          placeholder="Type your message..."
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="chat-send" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
