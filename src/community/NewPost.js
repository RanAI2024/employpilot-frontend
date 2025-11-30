import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import "./community.css";

function NewPost() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-set category if user clicked "Create Post in X"
  const prefillCategory = location.state?.category || "";

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(prefillCategory);
  const [username, setUsername] = useState("");
  const [userLocation, setUserLocation] = useState("");

  // Load username + location from user profile
  useEffect(() => {
    async function loadUser() {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setUsername(data.username || "User");
        setUserLocation(data.location || "");
      }
    }
    loadUser();
  }, []);

  const categories = [
    { id: "strategies", label: "Strategies & Tips" },
    { id: "interview-tips", label: "Interview Tips" },
    { id: "success-stories", label: "Success Stories" },
    { id: "salary-transparency", label: "Salary Transparency" },
    { id: "remote-work", label: "Remote Work & Freelancing" },
    { id: "resume-reviews", label: "Resume Reviews" },
    { id: "tech-careers", label: "Tech Careers" },
    { id: "career-change", label: "Breaking Into New Careers" },
    { id: "workplace-issues", label: "Workplace Issues" },
    { id: "networking", label: "Networking & Opportunities" },
  ];

  const submitPost = async () => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    if (!title.trim() || !body.trim() || !category) {
      return alert("Please fill out all fields.");
    }

    try {
      // Create post
      await addDoc(collection(db, "community_posts"), {
        title: title.trim(),
        body: body.trim(),
        category,
        username,
        location: userLocation,
        userId: user.uid,

        createdAt: Date.now(),
        updatedAt: Date.now(),

        // Default reactions
        reactions: {
          like: 0,
          celebrate: 0,
          insightful: 0,
          support: 0,
          funny: 0,
        },
      });

      navigate(`/community/topic/${category}`);
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Could not publish your post.");
    }
  };

  return (
    <div className="newpost-wrapper">
      <h1 className="forum-title">Create a New Post</h1>

      <div className="newpost-card">
        {/* Title */}
        <input
          type="text"
          className="newpost-input"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Body */}
        <textarea
          className="newpost-textarea"
          placeholder="Write your post here..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        {/* Category */}
        <select
          className="newpost-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a Topic...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Submit Button */}
        <button className="reply-btn" onClick={submitPost}>
          Publish Post
        </button>
      </div>

      {/* Back Button */}
      <button
        className="back-btn"
        onClick={() => navigate("/community")}
        style={{ marginTop: "20px" }}
      >
        ← Back to Community
      </button>
    </div>
  );
}

export default NewPost;
