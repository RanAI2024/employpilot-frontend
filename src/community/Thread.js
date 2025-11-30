import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDocs,
  startAfter,
  limit,
  increment,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Reactions from "../community/Reactions";
import axios from "axios";
import "./community.css";

function Thread() {
  const { id } = useParams(); // thread ID from URL

  const [post, setPost] = useState(null);

  // Replies
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");

  // Pagination
  const REPLIES_PAGE_SIZE = 20;
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const apiBase = process.env.REACT_APP_API_URL;

  // Emoji → Firestore key
  const reactionMap = {
    "👍": "like",
    "😂": "funny",
    "❤️": "heart",
    "🔥": "fire",
    "👏": "helpful",
  };

  /* ==========================================================
     1️⃣ LOAD THREAD POST
     ========================================================== */
  useEffect(() => {
    async function fetchPost() {
      try {
        const ref = doc(db, "community_posts", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setPost({
            id: snap.id,
            ...data,
            reactions: data.reactions || {
              like: 0,
              celebrate: 0,
              insightful: 0,
              support: 0,
              funny: 0,
            },
          });
        }
      } catch (err) {
        console.error("Error loading post:", err);
      }
    }

    fetchPost();
  }, [id]);

  /* ==========================================================
     2️⃣ PAGINATED LOAD OF REPLIES
     ========================================================== */
  async function loadReplies(initial = false) {
    try {
      if (initial) {
        setReplies([]);
        setLastDoc(null);
      }

      setLoadingMore(true);

      let qBase = query(
        collection(db, "community_posts", id, "replies"),
        orderBy("createdAt", "asc"),
        limit(REPLIES_PAGE_SIZE)
      );

      if (!initial && lastDoc) {
        qBase = query(
          collection(db, "community_posts", id, "replies"),
          orderBy("createdAt", "asc"),
          startAfter(lastDoc),
          limit(REPLIES_PAGE_SIZE)
        );
      }

      const snap = await getDocs(qBase);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setReplies((prev) => (initial ? list : [...prev, ...list]));
      setLastDoc(snap.docs[snap.docs.length - 1] || null);

      setLoading(false);
      setLoadingMore(false);
    } catch (err) {
      console.error("Error loading replies:", err);
    }
  }

  useEffect(() => {
    loadReplies(true);
  }, [id]);

  /* ==========================================================
     3️⃣ ADD REPLY EMOJI REACTION
     ========================================================== */
  const addReplyReaction = async (replyId, emoji) => {
    const key = reactionMap[emoji];
    const ref = doc(db, "community_posts", id, "replies", replyId);

    try {
      await updateDoc(ref, {
        [`replyReactions.${key}`]: increment(1),
      });
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  /* ==========================================================
     4️⃣ DELETE REPLY (author-only)
     ========================================================== */
  const deleteReply = async (replyId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, "community_posts", id, "replies", replyId));
      loadReplies(true);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ==========================================================
     5️⃣ SUBMIT REPLY (with AI)
     ========================================================== */
  const submitReply = async () => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");
    if (!replyText.trim()) return;

    const text = replyText.trim();
    setReplyText("");

    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      const username = snap.exists() ? snap.data().username : "User";

      // Save user reply
      await addDoc(collection(db, "community_posts", id, "replies"), {
        text,
        username,
        userId: user.uid,
        createdAt: Date.now(),
        isAI: false,
        replyReactions: {
          like: 0,
          funny: 0,
          heart: 0,
          fire: 0,
          helpful: 0,
        },
      });

      await updateDoc(doc(db, "community_posts", id), {
        updatedAt: Date.now(),
      });

      // AI auto-response
      const aiRes = await axios.post(`${apiBase}/api/ai-reply`, {
        message: text,
      });

      const aiReply =
        aiRes.data.reply || "I'm here to help — what can I clarify?";

      await addDoc(collection(db, "community_posts", id, "replies"), {
        text: aiReply,
        username: "EmployPilot AI",
        userId: "ai_bot",
        createdAt: Date.now(),
        isAI: true,
        replyReactions: {
          like: 0,
          funny: 0,
          heart: 0,
          fire: 0,
          helpful: 0,
        },
      });

      await updateDoc(doc(db, "community_posts", id), {
        updatedAt: Date.now(),
      });

      loadReplies(true);
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  if (!post)
    return <div className="forum-loading">Loading post...</div>;

  /* ==========================================================
     UI RENDER
     ========================================================== */
  return (
    <div className="thread-wrapper">
      {/* THREAD HEADER */}
      <div className="thread-card">
        <h2 className="thread-title">{post.title}</h2>

        <p className="thread-meta">
          Posted by <strong>{post.username || "User"}</strong> •{" "}
          {new Date(post.createdAt).toLocaleString()} •{" "}
          <span className="thread-category">{post.category}</span>
        </p>

        <p className="thread-body">{post.body}</p>

        <Reactions postId={id} post={post} />
      </div>

      {/* REPLIES */}
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

              {/* Username Mention + Timestamp */}
              <div className="bubble-meta">
                <span
                  className="username-mention"
                  onClick={() => setReplyText(`@${r.username} `)}
                >
                  @{r.username || "User"}
                </span>

                <span className="bubble-meta-time">
                  •{" "}
                  {new Date(r.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {/* Delete button (author only) */}
                {auth.currentUser?.uid === r.userId && (
                  <button
                    className="reply-delete-btn"
                    onClick={() => deleteReply(r.id)}
                  >
                    🗑
                  </button>
                )}
              </div>

              {/* Reply Reactions */}
              <div className="reply-reactions">
                {["👍", "😂", "❤️", "🔥", "👏"].map((emoji) => (
                  <span
                    key={emoji}
                    className="reply-react-btn"
                    onClick={() => addReplyReaction(r.id, emoji)}
                  >
                    {emoji}{" "}
                    {r.replyReactions?.[reactionMap[emoji]] > 0
                      ? r.replyReactions[reactionMap[emoji]]
                      : ""}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* LOAD MORE */}
      {lastDoc && (
        <button className="load-more-btn" onClick={() => loadReplies()}>
          {loadingMore ? "Loading..." : "Load More Replies"}
        </button>
      )}

      {/* REPLY BOX */}
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

