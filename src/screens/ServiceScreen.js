/* Service Screen */

import React from "react";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const ServiceScreen = () => {
  return (
    <div className="screen">
      <AppHeader title="Services" showBack={false} />
      <div className="container">
        <div className="card">
          <h2>🔧 Services</h2>
          <p>Access various insurance-related services and support.</p>
        </div>
        <div className="card">
          <h3>Available Services</h3>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>Policy Consultation</li>
            <li>Claim Assistance</li>
            <li>Policy Renewal</li>
            <li>Document Verification</li>
            <li>Customer Support</li>
          </ul>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ServiceScreen;
