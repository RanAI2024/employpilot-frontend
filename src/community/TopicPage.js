import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import Reactions from "./Reactions";
import "./community.css";

function TopicPage() {
  const { topicId } = useParams();
  const [posts, setPosts] = useState([]);

  // Category labels
  const topicLabels = {
    "strategies": "Strategies & Tips",
    "interview-tips": "Interview Tips",
    "success-stories": "Success Stories",
    "salary-transparency": "Salary Transparency",
    "remote-work": "Remote Work & Freelancing",
    "resume-reviews": "Resume Reviews",
    "tech-careers": "Tech Careers",
    "career-change": "Breaking Into New Careers",
    "workplace-issues": "Workplace Issues",
    "networking": "Networking & Opportunities",
  };

  const topicName = topicLabels[topicId] || "Unknown Topic";

  useEffect(() => {
    const q = query(
      collection(db, "community_posts"),
      where("category", "==", topicId),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
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

        setPosts(list);
      },
      (err) => {
        console.error("Topic query error:", err);
      }
    );

    return () => unsubscribe();
  }, [topicId]);

  return (
    <div className="forum-wrapper">
      {/* Back button */}
      <Link to="/community">
        <button className="back-btn">← Back to Community</button>
      </Link>

      {/* Title */}
      <h1 className="forum-title">{topicName}</h1>

      {/* Create Post */}
      <Link to="/community/new-post" state={{ category: topicId }}>
        <button className="newpost-btn">+ Create Post in {topicName}</button>
      </Link>

      {/* Posts */}
      <div className="forum-list">
        {posts.length === 0 ? (
          <p className="empty-msg">
            No posts in this topic yet — be the first to start the discussion!
          </p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              to={`/community/thread/${post.id}`}
              className="forum-card"
            >
              <div className="forum-card-top">
                <span className="forum-category">{topicName}</span>
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

              {/* 🔥 username + location */}
              <p className="forum-user">
                Posted by: {post.username || "User"}{" "}
                {post.location ? `• ${post.location}` : ""}
              </p>

              {/* Reactions */}
              <Reactions postId={post.id} post={post} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default TopicPage;
