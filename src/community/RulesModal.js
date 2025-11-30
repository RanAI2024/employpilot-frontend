import React from "react";
import "./rules.css";

function RulesModal({ onAccept }) {
  return (
    <div className="rules-overlay">
      <div className="rules-card">
        <h2 className="rules-title">Community Rules & Guidelines</h2>

        <p className="rules-desc">
          To keep EmployPilot's community helpful, supportive, and professional,
          please review and agree to the following rules:
        </p>

        <ul className="rules-list">
          <li>🤝 Be respectful — no harassment, insults, or personal attacks</li>
          <li>🚫 No discriminatory or offensive language</li>
          <li>🧠 Keep content career-focused and constructive</li>
          <li>🔒 No sharing of sensitive or private information</li>
          <li>📢 No spam, self-promotion, or external ads</li>
          <li>💼 Provide helpful and professional advice</li>
          <li>📌 Stay on topic within each discussion category</li>
        </ul>

        <button className="rules-btn" onClick={onAccept}>
          I Agree to the Rules
        </button>
      </div>
    </div>
  );
}

export default RulesModal;
