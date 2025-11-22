import React from "react";
import { Link } from "react-router-dom";
import "./community.css";

function AITools() {
  return (
    <div className="ai-wrapper">
      <h1 className="ai-title">🤖 EmployPilot AI Tools</h1>
      <p className="ai-subtitle">Smart tools to boost your career instantly.</p>

      <div className="ai-card-container">

        <Link to="/community/tools/resume-critique" className="ai-card">
          <h3 className="ai-card-title">📄 Resume Critique</h3>
          <p className="ai-card-body">
            Upload or paste your resume and get expert-level improvements.
          </p>
        </Link>

        <Link to="/community/tools/interview-coach" className="ai-card">
          <h3 className="ai-card-title">🎙 Interview Coach</h3>
          <p className="ai-card-body">
            Ask questions and get tailored interview practice answers.
          </p>
        </Link>

        <Link to="/community/tools/career-advisor" className="ai-card">
          <h3 className="ai-card-title">📊 Career Advisor</h3>
          <p className="ai-card-body">
            Career strategy, job search tips, and personalized direction.
          </p>
        </Link>

      </div>
    </div>
  );
}

export default AITools;
