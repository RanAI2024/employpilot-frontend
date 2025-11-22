import React from "react";
import { Link } from "react-router-dom";

function Success() {
  return (
    <div style={{
      textAlign: "center",
      paddingTop: "120px",
      backgroundColor: "#f8fafc",
      minHeight: "100vh"
    }}>
      <h1 style={{ color: "#16a34a", fontSize: "2rem", marginBottom: "10px" }}>
        ✅ Payment Successful!
      </h1>
      <p style={{ color: "#444", fontSize: "1.1rem" }}>
        Thank you for supporting EmployPilot. Your plan is now active.
      </p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none"
        }}
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

export default Success;
