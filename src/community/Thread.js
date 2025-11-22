import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import "./community.css";
import axios from "axios";

function Thread() {
  const { id } = useParams(); // thread ID
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const apiBase = process.env.REACT_APP_API_URL;

  // ===========================
  // 1. Load the thread/post
  // ===========================
  useEffect(() => {
    async function fetchPost() {
      try {
        const ref = doc(db, "community_posts", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setPost({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Error loading post:", err);
      }
    }
    fetchPost();
  }, [id]);

  // ===========================
  // 2. Load replies
  // ===========================
  async function loadReplies() {
    try {
      const q = query(
        collection(db, "community_posts", id, "replies"),
        orderBy("createdAt", "asc")
      );

      const snap = await getDocs(q);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setReplies(list);
    } catch (err) {
      console.error("Error loading replies:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadReplies();
  }, [id]);

  // ===========================
  // 3. Submit a reply (with AI)
  // ===========================
  const submitReply = async () => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");
    if (!replyText.trim()) return;

    const text = replyText.trim();
    setReplyText("");

    try {
      // Save the user's reply
      await addDoc(collection(db, "community_posts", id, "replies"), {
        text,
        userEmail: user.email,
        userId: user.uid,
        createdAt: Date.now(),
        isAI: false,
      });

      // Refresh immediately
      await loadReplies();

      // Handle AI auto-response
      const res = await axios.post(`${apiBase}/api/ai-reply`, {
        message: text,
      });

      const aiReply = res.data.reply || "Thanks for sharing — how can I help?";

      await addDoc(collection(db, "community_posts", id, "replies"), {
        text: aiReply,
        userEmail: "EmployPilot AI",
        userId: "ai_bot",
        createdAt: Date.now(),
        isAI: true,
      });

      // Reload replies
      await loadReplies();
    } catch (err) {
      console.error("Error posting reply:", err);
      alert("Could not post reply.");
    }
  };

  if (!post) {
    return <div className="forum-loading">Loading post...</div>;
  }

  return (
    <div className="thread-wrapper">

      {/* Thread Header */}
      <div className="thread-card">
        <h2 className="thread-title">{post.title}</h2>

        <p className="thread-meta">
          Posted by <strong>{post.userEmail}</strong> •{" "}
          {new Date(post.createdAt).toLocaleString()} •{" "}
          <span className="thread-category">{post.category}</span>
        </p>

        <p className="thread-body">{post.body}</p>
      </div>

      {/* Replies Section */}
      <h3 className="reply-header">Replies</h3>

      <div className="reply-list">
        {loading ? (
          <p className="forum-loading">Loading replies...</p>
        ) : replies.length === 0 ? (
          <p className="no-replies">No replies yet — start the discussion!</p>
        ) : (
          replies.map((r) => (
            <div
              key={r.id}
              className={r.isAI ? "reply-bubble-ai" : "reply-bubble"}
            >
              <p className="bubble-text">{r.text}</p>

              <span className="bubble-meta">
                {r.userEmail} •{" "}
                {new Date(r.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Write a Reply */}
      <div className="reply-box">
        <textarea
          className="reply-input"
          placeholder="Write a reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        ></textarea>

        <button className="reply-btn" onClick={submitReply}>
          Post Reply
        </button>
      </div>
    </div>
  );
}

export default Thread;
