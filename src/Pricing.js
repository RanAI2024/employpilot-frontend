import React from "react";
import axios from "axios";

const apiBase = process.env.REACT_APP_API_URL;

function Pricing() {
  const handleCheckout = async (plan) => {
    try {
      console.log("📤 Sending checkout request to:", `${apiBase}/api/create-checkout-session`);
      const res = await axios.post(`${apiBase}/api/create-checkout-session`, { plan });

      console.log("✅ Stripe session response:", res.data);

      if (res.data.url) {
        window.location.href = res.data.url; // redirect to Stripe checkout
      } else {
        alert("Checkout session could not be created. " + JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("❌ Stripe checkout error:", error.response ? error.response.data : error);
      alert("Error starting checkout. Please try again.");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0f4f8",
      flexDirection: "column"
    }}>
      <h1 style={{ marginBottom: "30px", color: "#333" }}>Choose Your Plan</h1>

      <div style={{
        display: "flex",
        gap: "30px",
        flexWrap: "wrap",
        justifyContent: "center"
      }}>

        {/* QUICK RESUME */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "30px",
          width: "280px",
          textAlign: "center"
        }}>
          <h2>Quick Resume</h2>
          <p>AI resume generator with a one-time fee.</p>
          <h3 style={{ color: "#007bff" }}>$1.99</h3>

          <button
            onClick={() => handleCheckout("one_time")}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "15px"
            }}
          >
            Purchase
          </button>
        </div>

        {/* EMPLOYPILOT PRO */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "30px",
          width: "280px",
          textAlign: "center"
        }}>
          <h2>EmployPilot Pro</h2>
          <p>Unlimited resume generation + premium templates.</p>
          <h3 style={{ color: "#28a745" }}>$5.99 / month</h3>

          <button
            onClick={() => handleCheckout("monthly")}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "15px"
            }}
          >
            Subscribe
          </button>

        </div>
      </div>
    </div>
  );
}

export default Pricing;
