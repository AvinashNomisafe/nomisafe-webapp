/* Policy Detail Screen */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AppHeader from "../components/AppHeader";
import { getPolicyDetail } from "../services/policy";

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

  const formatCurrency = (value) => {
    if (!value) return "N/A";
    return `₹${value.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <Layout>
        <AppHeader title="Policy Details" showBack={true} />
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading policy details...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <AppHeader title="Policy Details" showBack={true} />
        <div style={styles.loadingContainer}>
          <p style={styles.errorText}>{error}</p>
        </div>
      </Layout>
    );
  }

  if (!policy) return null;

  return (
    <Layout>
      <AppHeader title="Policy Details" showBack={true} />
      <div style={styles.content}>
        {/* Header with Icon */}
        <div style={styles.header}>
          <div style={styles.icon}>
            {policy.insurance_type === "HEALTH" ? "🏥" : "🛡️"}
          </div>
          <h1 style={styles.title}>{policy.name}</h1>
          <p style={styles.subtitle}>
            {policy.insurance_type === "HEALTH"
              ? "Health Insurance"
              : "Life Insurance"}
          </p>
        </div>

        {/* Policy Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Policy Information</h2>
          <div style={styles.table}>
            <div style={styles.row}>
              <span style={styles.label}>Policy Number</span>
              <span style={styles.value}>{policy.policy_number}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Insurer</span>
              <span style={styles.value}>{policy.insurer_name}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Uploaded</span>
              <span style={styles.value}>{formatDate(policy.uploaded_at)}</span>
            </div>
          </div>
        </div>

        {/* Coverage Details */}
        {policy.coverage && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Coverage Details</h2>
            <div style={styles.table}>
              <div style={styles.row}>
                <span style={styles.label}>Sum Assured</span>
                <span style={styles.value}>
                  {formatCurrency(policy.coverage.sum_assured)}
                </span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Premium Amount</span>
                <span style={styles.value}>
                  {formatCurrency(policy.coverage.premium_amount)}
                </span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Premium Frequency</span>
                <span style={styles.value}>
                  {policy.coverage.premium_frequency || "N/A"}
                </span>
              </div>
              {policy.coverage.issue_date && (
                <div style={styles.row}>
                  <span style={styles.label}>Issue Date</span>
                  <span style={styles.value}>
                    {formatDate(policy.coverage.issue_date)}
                  </span>
                </div>
              )}
              {policy.coverage.start_date && (
                <div style={styles.row}>
                  <span style={styles.label}>Start Date</span>
                  <span style={styles.value}>
                    {formatDate(policy.coverage.start_date)}
                  </span>
                </div>
              )}
              {policy.coverage.end_date && (
                <div style={styles.row}>
                  <span style={styles.label}>End Date</span>
                  <span style={styles.value}>
                    {formatDate(policy.coverage.end_date)}
                  </span>
                </div>
              )}
              {policy.coverage.maturity_date && (
                <div style={styles.row}>
                  <span style={styles.label}>Maturity Date</span>
                  <span style={styles.value}>
                    {formatDate(policy.coverage.maturity_date)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nominees */}
        {policy.nominees && policy.nominees.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Nominees</h2>
            {policy.nominees.map((nominee, index) => (
              <div key={index} style={styles.nomineeCard}>
                <div style={styles.nomineeName}>{nominee.name}</div>
                <div style={styles.nomineeDetails}>
                  <span style={styles.nomineeLabel}>Relationship:</span>
                  <span style={styles.nomineeValue}>
                    {nominee.relationship}
                  </span>
                </div>
                <div style={styles.nomineeDetails}>
                  <span style={styles.nomineeLabel}>Allocation:</span>
                  <span style={styles.nomineeValue}>
                    {nominee.allocation_percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Health Details */}
        {policy.health_details && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Health Insurance Details</h2>
            <div style={styles.table}>
              {policy.health_details.policy_type && (
                <div style={styles.row}>
                  <span style={styles.label}>Policy Type</span>
                  <span style={styles.value}>
                    {policy.health_details.policy_type}
                  </span>
                </div>
              )}
              {policy.health_details.room_rent_limit && (
                <div style={styles.row}>
                  <span style={styles.label}>Room Rent Limit</span>
                  <span style={styles.value}>
                    {formatCurrency(policy.health_details.room_rent_limit)}
                  </span>
                </div>
              )}
              {policy.health_details.copay_percentage !== null && (
                <div style={styles.row}>
                  <span style={styles.label}>Co-pay</span>
                  <span style={styles.value}>
                    {policy.health_details.copay_percentage}%
                  </span>
                </div>
              )}
              {policy.health_details.deductible_amount && (
                <div style={styles.row}>
                  <span style={styles.label}>Deductible</span>
                  <span style={styles.value}>
                    {formatCurrency(policy.health_details.deductible_amount)}
                  </span>
                </div>
              )}
              <div style={styles.row}>
                <span style={styles.label}>Restoration Benefit</span>
                <span style={styles.value}>
                  {policy.health_details.restoration_benefit ? "Yes" : "No"}
                </span>
              </div>
              {policy.health_details.no_claim_bonus !== null && (
                <div style={styles.row}>
                  <span style={styles.label}>No Claim Bonus</span>
                  <span style={styles.value}>
                    {policy.health_details.no_claim_bonus}%
                  </span>
                </div>
              )}
              {policy.health_details.waiting_period_days && (
                <div style={styles.row}>
                  <span style={styles.label}>Waiting Period</span>
                  <span style={styles.value}>
                    {policy.health_details.waiting_period_days} days
                  </span>
                </div>
              )}
            </div>

            {/* Covered Members */}
            {policy.health_details.covered_members &&
              policy.health_details.covered_members.length > 0 && (
                <div style={styles.membersSection}>
                  <h3 style={styles.subsectionTitle}>Covered Members</h3>
                  {policy.health_details.covered_members.map(
                    (member, index) => (
                      <div key={index} style={styles.memberCard}>
                        <div style={styles.memberName}>{member.name}</div>
                        <div style={styles.memberDetails}>
                          <span style={styles.memberLabel}>Relationship:</span>
                          <span style={styles.memberValue}>
                            {member.relationship}
                          </span>
                        </div>
                        {member.date_of_birth && (
                          <div style={styles.memberDetails}>
                            <span style={styles.memberLabel}>
                              Date of Birth:
                            </span>
                            <span style={styles.memberValue}>
                              {formatDate(member.date_of_birth)}
                            </span>
                          </div>
                        )}
                        {member.sum_insured && (
                          <div style={styles.memberDetails}>
                            <span style={styles.memberLabel}>Sum Insured:</span>
                            <span style={styles.memberValue}>
                              {formatCurrency(member.sum_insured)}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        )}

        {/* Benefits */}
        {policy.benefits && policy.benefits.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Benefits</h2>
            {policy.benefits.map((benefit, index) => (
              <div key={index} style={styles.benefitCard}>
                <div style={styles.benefitName}>{benefit.benefit_name}</div>
                {benefit.benefit_amount && (
                  <div style={styles.benefitAmount}>
                    {formatCurrency(benefit.benefit_amount)}
                  </div>
                )}
                {benefit.description && (
                  <div style={styles.benefitDescription}>
                    {benefit.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Exclusions */}
        {policy.exclusions && policy.exclusions.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Exclusions</h2>
            {policy.exclusions.map((exclusion, index) => (
              <div key={index} style={styles.exclusionCard}>
                <div style={styles.exclusionType}>
                  {exclusion.exclusion_type}
                </div>
                <div style={styles.exclusionDescription}>
                  {exclusion.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
  },
  content: {
    padding: "20px",
    paddingBottom: "40px",
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
  },
  icon: {
    fontSize: "64px",
    marginBottom: "12px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000",
    margin: 0,
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    marginTop: "4px",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#000",
    marginTop: 0,
    marginBottom: "16px",
  },
  subsectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    marginTop: "16px",
    marginBottom: "12px",
  },
  table: {
    width: "100%",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "12px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f0f0f0",
  },
  label: {
    fontSize: "14px",
    color: "#666",
    flex: 1,
  },
  value: {
    fontSize: "14px",
    color: "#000",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  nomineeCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "12px",
    borderLeft: "3px solid #4DB6AC",
  },
  nomineeName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#000",
    marginBottom: "8px",
  },
  nomineeDetails: {
    display: "flex",
    marginBottom: "4px",
  },
  nomineeLabel: {
    fontSize: "14px",
    color: "#666",
    width: "100px",
  },
  nomineeValue: {
    fontSize: "14px",
    color: "#000",
    flex: 1,
  },
  membersSection: {
    marginTop: "16px",
  },
  memberCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "8px",
  },
  memberName: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#000",
    marginBottom: "6px",
  },
  memberDetails: {
    display: "flex",
    marginBottom: "3px",
  },
  memberLabel: {
    fontSize: "13px",
    color: "#666",
    width: "110px",
  },
  memberValue: {
    fontSize: "13px",
    color: "#000",
    flex: 1,
  },
  benefitCard: {
    backgroundColor: "#E8F6F5",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "12px",
    borderLeft: "3px solid #4DB6AC",
  },
  benefitName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#000",
    marginBottom: "4px",
  },
  benefitAmount: {
    fontSize: "15px",
    color: "#4DB6AC",
    fontWeight: "600",
    marginBottom: "4px",
  },
  benefitDescription: {
    fontSize: "14px",
    color: "#666",
    marginTop: "4px",
  },
  exclusionCard: {
    backgroundColor: "#FFF5F5",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "12px",
    borderLeft: "3px solid #FF6B6B",
  },
  exclusionType: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#000",
    marginBottom: "4px",
  },
  exclusionDescription: {
    fontSize: "14px",
    color: "#666",
  },
};

export default PolicyDetailScreen;
