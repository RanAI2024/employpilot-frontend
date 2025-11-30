import React from "react";
import "./Terms.css"; // reuses the same styling

function Privacy() {
  return (
    <div className="terms-wrapper">
      <div className="terms-container">
        <h1>Privacy Policy</h1>
        <p>Last Updated: January 2025</p>

        <h2>1. Information We Collect</h2>
        <p>
          EmployPilot collects basic account information, resume input data,
          and usage analytics to improve platform performance.
        </p>

        <h2>2. How Your Data is Used</h2>
        <p>
          Data is used strictly for AI generation, account management,
          and platform personalization. We do not sell user data.
        </p>

        <h2>3. Data Security</h2>
        <p>
          EmployPilot uses encryption, secure authentication, and
          industry-standard cloud security to protect your information.
        </p>

        <h2>4. Third-party Services</h2>
        <p>
          EmployPilot integrates with OpenAI, Stripe, and Firebase. These
          services process data only as needed for platform functionality.
        </p>

        <h2>5. Contact</h2>
        <p>
          For privacy questions:  
          <br /> <strong>support@employpilot.com</strong>
        </p>

        <footer className="terms-footer">
          © 2025 EmployPilot. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}

export default Privacy;
