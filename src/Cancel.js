import React from "react";
import { Link } from "react-router-dom";

function Cancel() {
  return (
    <div style={{
      textAlign: "center",
      paddingTop: "120px",
      backgroundColor: "#fff8f8",
      minHeight: "100vh"
    }}>
      <h1 style={{ color: "#dc2626", fontSize: "2rem", marginBottom: "10px" }}>
        ❌ Payment Cancelled
      </h1>
      <p style={{ color: "#555", fontSize: "1.1rem" }}>
        Your transaction was cancelled. No payment was made.
      </p>
      <Link
        to="/pricing"
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
        Go Back to Pricing
      </Link>
    </div>
  );
}

export default Cancel;
