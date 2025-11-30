import React from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import "./reactions.css";

function Reactions({ postId, post }) {
  const react = async (type) => {
    const ref = doc(db, "community_posts", postId);

    await updateDoc(ref, {
      [`reactions.${type}`]: increment(1)
    });
  };

  return (
    <div className="reaction-bar">
      <span onClick={() => react("like")}>👍 {post.reactions?.like || 0}</span>
      <span onClick={() => react("celebrate")}>🎉 {post.reactions?.celebrate || 0}</span>
      <span onClick={() => react("insightful")}>💡 {post.reactions?.insightful || 0}</span>
      <span onClick={() => react("support")}>🤝 {post.reactions?.support || 0}</span>
      <span onClick={() => react("funny")}>😂 {post.reactions?.funny || 0}</span>
    </div>
  );
}

export default Reactions;
