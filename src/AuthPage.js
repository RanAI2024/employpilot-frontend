import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { createUserDocument } from "./createUserDoc";


function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/"); // ✅ Redirect to Dashboard after login
    });
    return unsubscribe;
  }, [navigate]);

  const handleSignup = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(auth.currentUser);
    navigate("/");
  } catch (err) {
    setError(err.message);
  }
};

  const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    await createUserDocument(auth.currentUser);
    navigate("/");
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>EmployPilot Login</h2>
      <input
        type="email"
        placeholder="Email"
        style={{ margin: "8px", padding: "10px" }}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        style={{ margin: "8px", padding: "10px" }}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleSignup} style={{ margin: "5px" }}>
        Sign Up
      </button>
      <button onClick={handleLogin} style={{ margin: "5px" }}>
        Log In
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default AuthPage;
