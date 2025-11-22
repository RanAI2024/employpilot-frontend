import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Navbar from "./Navbar"; // ✅ IMPORTANT

// Public pages
import AuthPage from "./AuthPage";
import Pricing from "./Pricing";
import Success from "./Success";
import Cancel from "./Cancel";

// Dashboard
import Dashboard from "./Dashboard";

// Pro access wrapper
import ProRoute from "./ProRoute";

// Community pages
import CommunityHome from "./community/CommunityHome";
import ChatRoom from "./community/ChatRoom";
import Forum from "./community/Forum";
import NewPost from "./community/NewPost";
import Thread from "./community/Thread";

// AI Tools
import AITools from "./community/AITools";
import ResumeCritique from "./community/ai/ResumeCritique";
import InterviewCoach from "./community/ai/InterviewCoach";
import CareerAdvisor from "./community/ai/CareerAdvisor";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "150px", fontSize: "18px" }}>
        Loading EmployPilot...
      </div>
    );
  }

  return (
    <Router>

      {/* Global navigation bar */}
      <Navbar user={user} />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />

        {/* PROTECTED: Dashboard */}
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/auth" replace />}
        />

        {/* ======================
              COMMUNITY ROUTES
           ====================== */}

        {/* Community homepage */}
        <Route
          path="/community"
          element={
            <ProRoute user={user}>
              <CommunityHome />
            </ProRoute>
          }
        />

        {/* Chat */}
        <Route
          path="/community/chat"
          element={
            <ProRoute user={user}>
              <ChatRoom />
            </ProRoute>
          }
        />

        {/* Forum */}
        <Route
          path="/community/forum"
          element={
            <ProRoute user={user}>
              <Forum />
            </ProRoute>
          }
        />

        {/* Create new post */}
        <Route
          path="/community/new-post"
          element={
            <ProRoute user={user}>
              <NewPost />
            </ProRoute>
          }
        />

        {/* Thread page */}
        <Route
          path="/community/thread/:id"
          element={
            <ProRoute user={user}>
              <Thread />
            </ProRoute>
          }
        />

        {/* ======================
               AI TOOLS ROUTES
           ====================== */}

        {/* AI Tools landing */}
        <Route
          path="/community/tools"
          element={
            <ProRoute user={user}>
              <AITools />
            </ProRoute>
          }
        />

        {/* Individual AI Tools */}
        <Route
          path="/community/tools/resume-critique"
          element={
            <ProRoute user={user}>
              <ResumeCritique />
            </ProRoute>
          }
        />

        <Route
          path="/community/tools/interview-coach"
          element={
            <ProRoute user={user}>
              <InterviewCoach />
            </ProRoute>
          }
        />

        <Route
          path="/community/tools/career-advisor"
          element={
            <ProRoute user={user}>
              <CareerAdvisor />
            </ProRoute>
          }
        />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "100px" }}>
              <h2>Page Not Found</h2>
              <p>Sorry, the page you’re looking for doesn’t exist.</p>
              <a href="/" style={{ color: "#007bff" }}>
                Go Home
              </a>
            </div>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;

