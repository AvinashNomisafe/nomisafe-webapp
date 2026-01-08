/* Properties Screen */

import React from "react";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const PropertiesScreen = () => {
  return (
    <div className="screen">
      <AppHeader title="Property Insurance" showBack={true} />
      <div className="container">
        <div className="card">
          <h2>🏠 Property Insurance</h2>
          <p>Manage your property insurance policies here.</p>
        </div>
        <div className="card">
          <h3>About Property Insurance</h3>
          <p>
            Property insurance protects your home and belongings against damage,
            theft, and natural disasters. Keep your assets secure.
          </p>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default PropertiesScreen;
