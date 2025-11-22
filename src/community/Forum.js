import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import "./community.css";

function Forum() {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = [
    "All",
    "Resume Writing",
    "Interview Prep",
    "Salary Negotiation",
    "Job Search Tips",
    "Career Growth",
    "Success Stories",
  ];

  // ============================
  // Load all forum posts
  // ============================
  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setPosts(list);
        setFiltered(list);
      } catch (err) {
        console.error("Error loading forum posts:", err);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  // ============================
  // Filter posts by category
  // ============================
  const filterByCategory = (cat) => {
    setActiveFilter(cat);

    if (cat === "All") {
      setFiltered(posts);
    } else {
      setFiltered(posts.filter((p) => p.category === cat));
    }
  };

  return (
    <div className="forum-wrapper">
      <h1 className="forum-title">📝 Career Forums</h1>
      <p className="forum-subtitle">
        Discuss job strategies, get advice, and share your experiences.
      </p>

      {/* CATEGORY FILTER CHIPS */}
      <div className="forum-categories">
        {categories.map((cat) => (
          <span
            key={cat}
            className={`category-chip ${activeFilter === cat ? "chip-active" : ""}`}
            onClick={() => filterByCategory(cat)}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* NEW POST BUTTON */}
      <div className="new-post-container">
        <Link to="/community/new-post" className="new-post-btn">
          + Create New Post
        </Link>
      </div>

      {/* POSTS LIST */}
      {loading ? (
        <div className="forum-loading">Loading posts...</div>
      ) : filtered.length === 0 ? (
        <p className="no-posts">No posts found under this category.</p>
      ) : (
        <div className="forum-posts">
          {filtered.map((post) => (
            <Link
              to={`/community/thread/${post.id}`}
              key={post.id}
              className="forum-card"
            >
              <h3 className="forum-card-title">{post.title}</h3>

              <p className="forum-card-body">
                {post.body.length > 160
                  ? post.body.substring(0, 160) + "..."
                  : post.body}
              </p>

              <div className="forum-meta">
                <span className="forum-category-tag">{post.category}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Forum;
