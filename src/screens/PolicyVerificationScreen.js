/* Policy Verification Screen - Upload Policy */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import { uploadPolicy } from "../services/policy";
import "./PolicyVerificationScreen.css";

const PolicyVerificationScreen = () => {
  const navigate = useNavigate();
  const [policyName, setPolicyName] = useState("");
  const [policyFile, setPolicyFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        setPolicyFile(file);
        setError("");
      } else {
        setError("Please select a PDF file");
        setPolicyFile(null);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!policyName) {
      setError("Please enter a policy name");
      return;
    }

    if (!policyFile) {
      setError("Please select a policy document");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await uploadPolicy(policyName, policyFile);
      alert("Policy uploaded successfully! AI extraction in progress...");
      navigate("/my-policy");
    } catch (err) {
      setError(err.message || "Failed to upload policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="policy-verification-screen">
      <AppHeader title="Upload Policy" showBack={true} />

      <div className="container">
        <div className="upload-card">
          <div className="upload-header">
            <div className="upload-icon">📤</div>
            <h2>Upload Your Policy</h2>
            <p>Upload your insurance policy document for AI extraction</p>
          </div>

          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label className="form-label">Policy Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., HDFC Life Insurance"
                value={policyName}
                onChange={(e) => {
                  setPolicyName(e.target.value);
                  setError("");
                }}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Policy Document (PDF)</label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="file-input"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={loading}
                  style={{ display: "none" }}
                />
                <label htmlFor="file-input" className="file-input-label">
                  <span className="file-icon">📄</span>
                  <span className="file-text">
                    {policyFile ? policyFile.name : "Choose PDF file"}
                  </span>
                </label>
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
              type="submit"
              className={`btn btn-primary btn-full ${
                loading ? "btn-disabled" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Policy"}
            </button>
          </form>

          <div className="upload-info">
            <h4>What happens next?</h4>
            <ul>
              <li>📄 Your policy document will be uploaded securely</li>
              <li>🤖 AI will extract key information automatically</li>
              <li>✅ Review and verify the extracted details</li>
              <li>💾 Policy will be saved in your vault</li>
            </ul>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PolicyVerificationScreen;
