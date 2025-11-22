import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./community.css";

function NewPost() {
  const navigate = useNavigate();

  const categories = [
    "Resume Writing",
    "Interview Prep",
    "Salary Negotiation",
    "Job Search Tips",
    "Career Growth",
    "Success Stories",
  ];

  const [form, setForm] = useState({
    title: "",
    body: "",
    category: categories[0],
  });

  const [loading, setLoading] = useState(false);

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitPost = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "community_posts"), {
  title: form.title,
  body: form.body,
  category: form.category,
  userEmail: user.email,
  userId: user.uid,
  createdAt: Date.now(),
});


      navigate(`/community/thread/${docRef.id}`);
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Could not create post.");
    }

    setLoading(false);
  };

  return (
    <div className="forum-wrapper">
      <h1 className="forum-title">Create New Post</h1>

      <div className="newpost-form">
        
        <label className="newpost-label">Title</label>
        <input
          type="text"
          name="title"
          className="newpost-input"
          placeholder="Enter your discussion title..."
          value={form.title}
          onChange={updateForm}
        />

        <label className="newpost-label">Category</label>
        <select
          name="category"
          className="newpost-select"
          value={form.category}
          onChange={updateForm}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        <label className="newpost-label">Post Content</label>
        <textarea
          name="body"
          className="newpost-textarea"
          placeholder="Write your post here..."
          value={form.body}
          onChange={updateForm}
        ></textarea>

        <button className="newpost-btn" onClick={submitPost} disabled={loading}>
          {loading ? "Posting..." : "Submit Post"}
        </button>
      </div>
    </div>
  );
}

export default NewPost;
