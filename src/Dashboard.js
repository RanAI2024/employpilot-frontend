import React, { useState } from "react";
import axios from "axios";
import { auth } from "./firebase";
import "./Dashboard.css";

function Dashboard() {
  const apiBase = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    skills: "",
    experience: "",
    education: "",
  });

  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiBase}/api/generate-resume`, {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
      });

      setResume(res.data.resume || "");
      setPdfUrl(res.data.pdf_url || "");
    } catch (err) {
      console.error(err);
      setResume("⚠ Error generating resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // Pro Paywall → block free users
    setShowPaywall(true);
  };

  const handleLogout = async () => {
    await auth.signOut();
    window.location.reload();
  };

  return (
    <div className="dash-wrapper">
      <div className="dash-container">

        {/* Header */}
        <h2 className="dash-title">Welcome to EmployPilot ✨</h2>
        <p className="dash-subtitle">
          Your AI-powered resume builder and career assistant.
        </p>

        {/* Form */}
        <div className="form-card">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="input-field"
          />

          <input
            type="text"
            name="role"
            placeholder="Job Role"
            onChange={handleChange}
            className="input-field"
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            onChange={handleChange}
            className="input-field"
          />

          <textarea
            name="experience"
            placeholder="Work Experience"
            onChange={handleChange}
            className="textarea-field"
          />

          <textarea
            name="education"
            placeholder="Education"
            onChange={handleChange}
            className="textarea-field"
          />

          <button onClick={handleGenerate} disabled={loading} className="primary-btn">
            {loading ? "Generating..." : "Generate Resume"}
          </button>
        </div>

        {/* Resume Preview */}
        {resume && (
          <div className="resume-preview">
            <h3 className="preview-title">AI Generated Resume</h3>
            <pre className="resume-box">{resume}</pre>

            {/* PDF Download Button - Paywall */}
            <button className="download-btn" onClick={handleDownloadPDF}>
              Download PDF (Pro Only)
            </button>
          </div>
        )}

        {/* Logout */}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* PRO PAYWALL MODAL */}
      {showPaywall && (
        <div className="paywall-overlay" onClick={() => setShowPaywall(false)}>
          <div className="paywall-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="paywall-title">Unlock PDF Downloads</h3>
            <p className="paywall-desc">
              Upgrade to EmployPilot Pro to unlock unlimited PDF downloads, premium templates,
              AI cover letters, interview prep tools, and access to the Career Lounge.
            </p>

            <div className="paywall-buttons">
              <a href="/pricing" className="paywall-btn-primary">Upgrade to Pro</a>
              <button className="paywall-btn-secondary" onClick={() => setShowPaywall(false)}>
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;

