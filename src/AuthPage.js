import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import "./auth.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";



function AuthPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // login | signup
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
await sendEmailVerification(userCred.user);

// Save username to Firestore
await setDoc(doc(db, "users", userCred.user.uid), {
  email,
  username,
  createdAt: Date.now(),
  isPro: false,
  rulesAccepted: false
});


      setMessage("Account created! Please check your email to verify before logging in. Also, be sure to check your junk or spam folder.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleLogin = async () => {
  try {
    // Step 1: Sign in
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Step 2: Force Firebase to refresh account data
    await result.user.reload();
    const refreshedUser = auth.currentUser;

    // Step 3: Check verification status
    if (!refreshedUser.emailVerified) {
      setMessage("Please verify your email before logging in.");
      return;
    }

    // Step 4: Forward to dashboard
    window.location.href = "/";
  } catch (err) {
    setMessage(err.message);
  }
};


  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <h1 className="auth-title">Welcome to EmployPilot ✨</h1>
        <p className="auth-tagline">
          Your career-boosting AI platform for resume writing, job prep, 
          community guidance, and professional growth.
        </p>

        <ul className="auth-benefits">
          <li>⚡ AI-Powered Resume Builder</li>
          <li>💬 Pro Community & Career Forums</li>
          <li>🤖 AI Interview Coach & Career Advisor</li>
          <li>📄 Unlimited PDF Downloads</li>
          <li>🚀 Everything you need to level up your career</li>
        </ul>
      </div>

      <div className="auth-box">
        <h2>{mode === "login" ? "Log Into Your Account" : "Create Your Account"}</h2>
        {mode === "signup" && (
  <input
    type="text"
    placeholder="Choose a username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="auth-input"
  />
)}

        <input 
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />

        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />

        {message && <p className="auth-message">{message}</p>}

        {mode === "login" ? (
          <>
            <button className="auth-btn" onClick={handleLogin}>Log In</button>
            <p className="auth-switch">
              Don’t have an account? <span onClick={() => setMode("signup")}>Sign up</span>
            </p>
          </>
        ) : (
          <>
            <button className="auth-btn" onClick={handleSignup}>Create Account</button>
            <p className="auth-switch">
              Already have an account? <span onClick={() => setMode("login")}>Log in</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
