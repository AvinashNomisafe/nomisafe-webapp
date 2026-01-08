/* Tutorials Screen */

import React from "react";
import AppHeader from "../components/AppHeader";

const TutorialsScreen = () => {
  return (
    <div className="screen">
      <AppHeader title="Tutorials" showBack={true} />
      <div className="container">
        <div className="card">
          <h2>📚 Tutorials</h2>
          <p>Learn how to use NomiSafe effectively.</p>
        </div>

        <div className="card">
          <h3>Getting Started</h3>
          <ol style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>Upload your insurance policy documents</li>
            <li>Wait for AI extraction to complete</li>
            <li>Review and verify the extracted information</li>
            <li>Access your policies anytime from Safe Vault</li>
          </ol>
        </div>

        <div className="card">
          <h3>Tips & Tricks</h3>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>Upload clear, high-quality PDF documents</li>
            <li>Verify your Aadhaar for enhanced security</li>
            <li>Keep your profile information updated</li>
            <li>Check policy expiry dates regularly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TutorialsScreen;
