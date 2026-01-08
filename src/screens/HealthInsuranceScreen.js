/* Health Insurance Screen */

import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const HealthInsuranceScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <AppHeader title="Health Insurance" showBack={true} />
      <div className="container">
        <div className="card">
          <h2>🏥 Health Insurance</h2>
          <p>Manage your health insurance policies here.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/my-policy")}
            style={{ marginTop: "16px" }}
          >
            View All Policies
          </button>
        </div>
        <div className="card">
          <h3>About Health Insurance</h3>
          <p>
            Health insurance covers medical expenses including hospitalization,
            surgeries, and treatments. Stay protected against rising healthcare
            costs.
          </p>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default HealthInsuranceScreen;
