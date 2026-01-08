/* Policy Detail Screen */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Loading from "../components/common/Loading";
import { getPolicyDetail } from "../services/policy";
import "./PolicyDetailScreen.css";

const PolicyDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPolicyDetail();
  }, [id]);

  const loadPolicyDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPolicyDetail(id);
      setPolicy(data);
    } catch (err) {
      setError(err.message || "Failed to load policy details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading policy details..." />;
  if (error) return <div className="error-message">{error}</div>;
  if (!policy) return null;

  return (
    <div className="policy-detail-screen">
      <AppHeader title="Policy Details" showBack={true} />

      <div className="container">
        <div className="detail-card">
          <h2 className="policy-title">{policy.name}</h2>

          <div className="detail-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="detail-row">
              <span className="detail-label">Policy Number:</span>
              <span className="detail-value">
                {policy.policy_number || "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Insurer:</span>
              <span className="detail-value">
                {policy.insurer_name || "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Insurance Type:</span>
              <span className="detail-value">
                {policy.insurance_type || "N/A"}
              </span>
            </div>
          </div>

          {policy.coverage && (
            <div className="detail-section">
              <h3 className="section-title">Coverage Details</h3>
              <div className="detail-row">
                <span className="detail-label">Sum Assured:</span>
                <span className="detail-value">
                  ₹{policy.coverage.sum_assured || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Premium Amount:</span>
                <span className="detail-value">
                  ₹{policy.coverage.premium_amount || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Premium Frequency:</span>
                <span className="detail-value">
                  {policy.coverage.premium_frequency || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Start Date:</span>
                <span className="detail-value">
                  {policy.coverage.start_date || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">End Date:</span>
                <span className="detail-value">
                  {policy.coverage.end_date || "N/A"}
                </span>
              </div>
            </div>
          )}

          {policy.nominees && policy.nominees.length > 0 && (
            <div className="detail-section">
              <h3 className="section-title">Nominees</h3>
              {policy.nominees.map((nominee, index) => (
                <div key={index} className="nominee-card">
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{nominee.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Relationship:</span>
                    <span className="detail-value">{nominee.relationship}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Allocation:</span>
                    <span className="detail-value">
                      {nominee.allocation_percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {policy.benefits && policy.benefits.length > 0 && (
            <div className="detail-section">
              <h3 className="section-title">Benefits</h3>
              {policy.benefits.map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <h4>{benefit.benefit_name}</h4>
                  <p>{benefit.description || "No description"}</p>
                  {benefit.benefit_amount && (
                    <strong>Amount: ₹{benefit.benefit_amount}</strong>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailScreen;
