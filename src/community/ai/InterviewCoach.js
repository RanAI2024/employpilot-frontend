import React, { useState } from "react";
import axios from "axios";
import "../../community.css";

function InterviewCoach() {
  const [question, setQuestion] = useState("");
  const [coach, setCoach] = useState("");
  const [loading, setLoading] = useState(false);
  const apiBase = process.env.REACT_APP_API_URL;

  const askCoach = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setCoach("");

    try {
      const res = await axios.post(`${apiBase}/api/ai-interview-coach`, {
        question,
      });

      setCoach(res.data.coach);
    } catch (err) {
      console.error("Interview coach error:", err);
      setCoach("Error generating interview guidance.");
    }

    setLoading(false);
  };

  return (
    <div className="ai-tool-wrapper">
      <h2 className="ai-tool-title">🎙 Interview Coach</h2>

      <textarea
        className="ai-input"
        placeholder="Ask an interview or HR-related question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      ></textarea>

      <button className="ai-btn" onClick={askCoach} disabled={loading}>
        {loading ? "Thinking..." : "Get Coaching Advice"}
      </button>

      {coach && (
        <div className="ai-output">
          <h3 className="ai-output-title">Response</h3>
          <pre className="ai-output-box">{coach}</pre>
        </div>
      )}
    </div>
  );
}

export default InterviewCoach;
