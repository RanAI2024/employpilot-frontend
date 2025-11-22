import React, { useState } from "react";
import axios from "axios";
import "../../community.css";

function CareerAdvisor() {
  const [topic, setTopic] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const apiBase = process.env.REACT_APP_API_URL;

  const getAdvice = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setAdvice("");

    try {
      const res = await axios.post(`${apiBase}/api/ai-career-advisor`, {
        topic,
      });

      setAdvice(res.data.advice);
    } catch (err) {
      console.error("Career advisor error:", err);
      setAdvice("Error generating career advice.");
    }

    setLoading(false);
  };

  return (
    <div className="ai-tool-wrapper">
      <h2 className="ai-tool-title">📊 Career Advisor</h2>

      <textarea
        className="ai-input"
        placeholder="Describe a career question or decision..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      ></textarea>

      <button className="ai-btn" onClick={getAdvice} disabled={loading}>
        {loading ? "Thinking..." : "Get Advice"}
      </button>

      {advice && (
        <div className="ai-output">
          <h3 className="ai-output-title">Advice</h3>
          <pre className="ai-output-box">{advice}</pre>
        </div>
      )}
    </div>
  );
}

export default CareerAdvisor;
