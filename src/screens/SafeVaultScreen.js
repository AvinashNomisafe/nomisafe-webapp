/* Safe Vault Screen */

import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const SafeVaultScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <AppHeader title="Safe Vault" showBack={false} />
      <div className="container">
        <div className="card">
          <h2>🔒 Safe Vault</h2>
          <p>Your secure storage for all insurance documents.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/my-policy")}
            style={{ marginTop: "16px" }}
          >
            View All Documents
          </button>
        </div>
        <div className="card">
          <h3>Features</h3>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>Secure cloud storage</li>
            <li>Easy access anytime</li>
            <li>Organized by policy type</li>
            <li>Quick search and filter</li>
          </ul>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default SafeVaultScreen;
