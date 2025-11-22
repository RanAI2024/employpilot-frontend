import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "./community.css";

function CommunityHome() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "community_posts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="forum-wrapper">
      <h1 className="forum-title">Community Discussions</h1>

      <Link to="/community/newpost">
        <button className="newpost-btn">+ Create New Post</button>
      </Link>

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

              <p className="forum-user">Posted by: {post.userEmail}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default CommunityHome;
