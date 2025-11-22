import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./ProRoute.css";

function ProRoute({ user, children }) {
  const [isPro, setIsPro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkProStatus() {
      if (!user) {
        setIsPro(false);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists() && snap.data().isPro === true) {
          setIsPro(true);
        } else {
          setIsPro(false);
        }
      } catch (err) {
        console.error("Error checking PRO status:", err);
        setIsPro(false);
      }

      setLoading(false);
    }

    checkProStatus();
  }, [user]);

  if (loading) {
    return (
      <div className="pro-loading">
        Checking Pro status...
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="pro-paywall-wrapper">
        <div className="pro-paywall-card">
          <h2 className="pro-title">Unlock Career Lounge</h2>
          <p className="pro-desc">
            This feature is included in <strong>EmployPilot Pro</strong> only.  
            Access exclusive AI tools, real-time chat, forums, and unlimited PDFs.
          </p>

          <a href="/pricing" className="pro-upgrade-btn">
            Upgrade to Pro
          </a>

          <button
            className="pro-cancel-btn"
            onClick={() => (window.location.href = "/")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default ProRoute;
