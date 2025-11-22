import React, { useState } from "react";
import axios from "axios";
import "../../community.css";

function ResumeCritique() {
  const [resume, setResume] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const apiBase = process.env.REACT_APP_API_URL;

  const analyzeResume = async () => {
    if (!resume.trim()) return alert("Paste your resume text first.");

    setLoading(true);
    setAnalysis("");

    try {
      const res = await axios.post(`${apiBase}/api/ai-resume-critique`, {
        resume,
      });

      setAnalysis(res.data.analysis);
    } catch (err) {
      console.error("Resume critique error:", err);
      setAnalysis("Error analyzing resume.");
    }

    setLoading(false);
  };

  return (
    <div className="ai-tool-wrapper">
      <h2 className="ai-tool-title">📄 Resume Critique</h2>

      <textarea
        className="ai-input"
        placeholder="Paste your resume text..."
        value={resume}
        onChange={(e) => setResume(e.target.value)}
      ></textarea>

      <button className="ai-btn" onClick={analyzeResume} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {analysis && (
        <div className="ai-output">
          <h3 className="ai-output-title">Analysis</h3>
          <pre className="ai-output-box">{analysis}</pre>
        </div>
      )}
    </div>
  );
}

export default ResumeCritique;
