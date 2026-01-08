import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { store } from "./store/store";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { theme } from "./theme";

// Import Screens
import PhoneLoginScreen from "./screens/PhoneLoginScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import HomeScreen from "./screens/HomeScreen";
import MyPolicyScreen from "./screens/MyPolicyScreen";
import PolicyDetailScreen from "./screens/PolicyDetailScreen";
import PolicyVerificationScreen from "./screens/PolicyVerificationScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LifeInsuranceScreen from "./screens/LifeInsuranceScreen";
import HealthInsuranceScreen from "./screens/HealthInsuranceScreen";
import PropertiesScreen from "./screens/PropertiesScreen";
import ServiceScreen from "./screens/ServiceScreen";
import SafeVaultScreen from "./screens/SafeVaultScreen";
import TutorialsScreen from "./screens/TutorialsScreen";
import AadhaarVerificationScreen from "./screens/AadhaarVerificationScreen";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <PhoneLoginScreen />
          </PublicRoute>
        }
      />
      <Route
        path="/otp-verification"
        element={
          <PublicRoute>
            <OTPVerificationScreen />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomeScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-policy"
        element={
          <ProtectedRoute>
            <MyPolicyScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/policy/:id"
        element={
          <ProtectedRoute>
            <PolicyDetailScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify-policy"
        element={
          <ProtectedRoute>
            <PolicyVerificationScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/life-insurance"
        element={
          <ProtectedRoute>
            <LifeInsuranceScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/health-insurance"
        element={
          <ProtectedRoute>
            <HealthInsuranceScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/properties"
        element={
          <ProtectedRoute>
            <PropertiesScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service"
        element={
          <ProtectedRoute>
            <ServiceScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/safe-vault"
        element={
          <ProtectedRoute>
            <SafeVaultScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutorials"
        element={
          <ProtectedRoute>
            <TutorialsScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aadhaar-verification"
        element={
          <ProtectedRoute>
            <AadhaarVerificationScreen />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
