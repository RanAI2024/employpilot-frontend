import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./ProRoute.css";
import RulesModal from "./community/RulesModal";

function ProRoute({ user, children }) {
  const [isPro, setIsPro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rulesAccepted, setRulesAccepted] = useState(null);

  const ADMIN_UID = "L58LMIJJycTGSrLm1Vqrajmlapa2"; // <-- YOUR UID HERE

  // 1️⃣ CHECK PRO STATUS
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

  // 2️⃣ CHECK COMMUNITY RULES ACCEPTANCE
  useEffect(() => {
    if (!user) return;

    const checkRules = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().rulesAccepted) {
        setRulesAccepted(true);
      } else {
        setRulesAccepted(false);
      }
    };

    checkRules();
  }, [user]);

  // 3️⃣ LOADING STATE
  if (loading || rulesAccepted === null) {
    return <div className="pro-loading">Checking access...</div>;
  }

  // 4️⃣ ADMIN OVERRIDE
  if (user && user.uid === ADMIN_UID) {
    return children;
  }

  // 5️⃣ SHOW COMMUNITY RULES MODAL IF NOT ACCEPTED
  if (rulesAccepted === false) {
    return (
      <RulesModal
        onAccept={async () => {
          await updateDoc(doc(db, "users", user.uid), {
            rulesAccepted: true
          });
          setRulesAccepted(true);
        }}
      />
    );
  }

  // 6️⃣ NORMAL PRO PAYWALL
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

  // 7️⃣ ACCESS GRANTED
  return children;
}

export default ProRoute;

