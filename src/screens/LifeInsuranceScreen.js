/* Life Insurance Screen */

import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const LifeInsuranceScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <AppHeader title="Life Insurance" showBack={true} />
      <div className="container">
        <div className="card">
          <h2>❤️ Life Insurance</h2>
          <p>Manage your life insurance policies here.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/my-policy")}
            style={{ marginTop: "16px" }}
          >
            View All Policies
          </button>
        </div>
        <div className="card">
          <h3>About Life Insurance</h3>
          <p>
            Life insurance provides financial protection to your family in case
            of an unfortunate event. It ensures your loved ones are taken care
            of financially.
          </p>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default LifeInsuranceScreen;
