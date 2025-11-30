import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "./community.css";
import Reactions from "../community/Reactions";

function CommunityHome() {
  const [posts, setPosts] = useState([]);
  const [topicCounts, setTopicCounts] = useState({});
  const [trending, setTrending] = useState([]);
  const [activeThreads, setActiveThreads] = useState([]);

  const topics = [
    { id: "strategies", label: "Strategies & Tips", icon: "💡" },
    { id: "interview-tips", label: "Interview Tips", icon: "🎤" },
    { id: "success-stories", label: "Success Stories", icon: "🌟" },
    { id: "salary-transparency", label: "Salary Transparency", icon: "💰" },
    { id: "remote-work", label: "Remote Work & Freelancing", icon: "🏡" },
    { id: "resume-reviews", label: "Resume Reviews", icon: "📝" },
    { id: "tech-careers", label: "Tech Careers", icon: "💻" },
    { id: "career-change", label: "Breaking Into New Careers", icon: "🎯" },
    { id: "workplace-issues", label: "Workplace Issues", icon: "⚖" },
    { id: "networking", label: "Networking & Opportunities", icon: "🤝" },
  ];

  // 1️⃣ CATEGORY COUNTS
  useEffect(() => {
    const q = query(collection(db, "community_posts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts = {};
      snapshot.docs.forEach((doc) => {
        const cat = doc.data().category;
        counts[cat] = (counts[cat] || 0) + 1;
      });
      setTopicCounts(counts);
    });
    return () => unsubscribe();
  }, []);

  // 2️⃣ LOAD RECENT POSTS
  useEffect(() => {
    const q = query(
      collection(db, "community_posts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        reactions: doc.data().reactions || {
          like: 0,
          celebrate: 0,
          insightful: 0,
          support: 0,
          funny: 0,
        },
      }));
      setPosts(data);
    });

    return () => unsubscribe();
  }, []);

  // 3️⃣ TRENDING TOPICS (LAST 7 DAYS)
  useEffect(() => {
    const q = query(collection(db, "community_posts"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = Date.now();
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const counts = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const time = new Date(data.createdAt).getTime();
        if (time > weekAgo) {
          counts[data.category] = (counts[data.category] || 0) + 1;
        }
      });

      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map((entry) => entry[0]);

      setTrending(sorted);
    });

    return () => unsubscribe();
  }, []);

  // 4️⃣ LATEST ACTIVE THREADS
  useEffect(() => {
    const q = query(
      collection(db, "community_posts"),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const latest = snapshot.docs.slice(0, 3).map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActiveThreads(latest);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="forum-wrapper">
      <h1 className="forum-title">Community Discussions</h1>

      <Link to="/community/new-post">
        <button className="newpost-btn">+ Create New Post</button>
      </Link>

      {/* 🔥 Trending Section */}
      {trending.length > 0 && (
        <div className="trending-box">
          <h2 className="topic-header">🔥 Trending This Week</h2>
          <div className="trending-list">
            {trending.map((cat) => {
              const topic = topics.find((t) => t.id === cat);
              return (
                <Link
                  key={cat}
                  to={`/community/topic/${cat}`}
                  className="trending-item"
                >
                  {topic.icon} {topic.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 📘 Topic list */}
      <div className="topic-section">
        <h2 className="topic-header">Browse Topics</h2>
        <div className="topic-list">
          {topics.map((t) => (
            <Link
              key={t.id}
              to={`/community/topic/${t.id}`}
              className="topic-item"
            >
              <div className="topic-left">
                <span className="topic-icon">{t.icon}</span>
                <span>{t.label}</span>
              </div>

              <span className="topic-count">{topicCounts[t.id] || 0}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 💬 Latest Activity */}
      <div className="active-box">
        <h2 className="topic-header">💬 Latest Activity</h2>
        <div className="active-list">
          {activeThreads.map((t) => (
            <Link key={t.id} to={`/community/thread/${t.id}`} className="active-item">
              <strong>{t.title}</strong>
              <span className="active-meta">
                {new Date(t.updatedAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 📝 All Posts */}
      <div className="forum-list">
        {posts.length === 0 ? (
          <p className="empty-msg">No posts yet — be the first to share!</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              to={`/community/thread/${post.id}`}
              className="forum-card"
            >
              <div className="forum-card-top">
                <span className="forum-category">{post.category}</span>
                <span className="forum-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="forum-card-title">{post.title}</h3>

              <p className="forum-card-body">
                {post.body.length > 120
                  ? post.body.substring(0, 120) + "..."
                  : post.body}
              </p>

              {/* ⭐ Username + Location */}
              <p className="forum-user">
                Posted by: {post.username || "User"}{" "}
                {post.location ? `• ${post.location}` : ""}
              </p>

              {/* 🔥 Reactions */}
              <Reactions postId={post.id} post={post} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default CommunityHome;

