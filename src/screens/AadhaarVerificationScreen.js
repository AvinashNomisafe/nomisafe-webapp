/* Aadhaar Verification Screen */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { verifyAadhaar } from "../services/auth";

const AadhaarVerificationScreen = () => {
  const navigate = useNavigate();
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (aadhaarNumber.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await verifyAadhaar(aadhaarNumber);
      alert("Aadhaar verified successfully!");
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <AppHeader title="Aadhaar Verification" showBack={true} />
      <div className="container">
        <div
          className="card"
          style={{ maxWidth: "500px", margin: "40px auto" }}
        >
          <h2>Verify Your Aadhaar</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Enter your 12-digit Aadhaar number to verify your identity
          </p>
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label className="form-label">Aadhaar Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter 12-digit number"
                value={aadhaarNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 12);
                  setAadhaarNumber(value);
                  setError("");
                }}
                maxLength="12"
                disabled={loading}
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Aadhaar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AadhaarVerificationScreen;
