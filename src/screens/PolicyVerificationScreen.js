/* Policy Verification Screen - Verify AI Extracted Data */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import AppHeader from "../components/AppHeader";
import { verifyPolicy } from "../services/policy";

const PolicyVerificationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { policyId, extractedData } = location.state || {};

  // State for editable fields
  const [insuranceType, setInsuranceType] = useState(
    extractedData?.insurance_type || ""
  );
  const [policyNumber, setPolicyNumber] = useState(
    extractedData?.policy_number || ""
  );
  const [sumAssured, setSumAssured] = useState(
    extractedData?.coverage?.sum_assured?.toString() || ""
  );
  const [premiumAmount, setPremiumAmount] = useState(
    extractedData?.coverage?.premium_amount?.toString() || ""
  );
  const [nomineeName, setNomineeName] = useState(
    extractedData?.nominees?.[0]?.name || ""
  );
  const [nomineeRelationship, setNomineeRelationship] = useState(
    extractedData?.nominees?.[0]?.relationship || ""
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!policyNumber.trim()) {
      alert("Policy number is required");
      return;
    }

    if (!sumAssured.trim() || isNaN(Number(sumAssured))) {
      alert("Please enter a valid sum assured amount");
      return;
    }

    if (!premiumAmount.trim() || isNaN(Number(premiumAmount))) {
      alert("Please enter a valid premium amount");
      return;
    }

    try {
      setIsLoading(true);

      // Prepare verified data
      const verifiedData = {
        ...extractedData,
        insurance_type: insuranceType,
        policy_number: policyNumber,
        coverage: {
          ...extractedData.coverage,
          sum_assured: Number(sumAssured),
          premium_amount: Number(premiumAmount),
        },
      };

      // Update nominees if provided
      if (nomineeName.trim()) {
        verifiedData.nominees = [
          {
            name: nomineeName,
            relationship: nomineeRelationship || "Unknown",
            allocation_percentage:
              extractedData.nominees?.[0]?.allocation_percentage || 100,
          },
        ];
      }

      // Call verify API
      await verifyPolicy(policyId, verifiedData);

      alert("Policy verified and saved successfully!");

      // Navigate back to appropriate insurance screen based on type
      if (insuranceType === "LIFE") {
        navigate("/life-insurance");
      } else if (insuranceType === "HEALTH") {
        navigate("/health-insurance");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert(error.message || "Failed to verify policy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatInsuranceType = (type) => {
    if (type === "LIFE") return "Life Insurance";
    if (type === "HEALTH") return "Health Insurance";
    return type;
  };

  if (!policyId || !extractedData) {
    return (
      <Layout>
        <AppHeader showBackButton={true} showMenu={true} />
        <div style={styles.container}>
          <div style={styles.content}>
            <p style={styles.errorText}>
              No policy data available for verification
            </p>
            <button style={styles.button} onClick={() => navigate("/home")}>
              Go to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AppHeader showBackButton={true} showMenu={true} />
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.iconContainer}>✅</div>
          <h1 style={styles.pageTitle}>Verify Policy Details</h1>
          <p style={styles.subtitle}>
            Please review and edit the extracted information
          </p>

          <form style={styles.form} onSubmit={handleVerify}>
            <div style={styles.fieldContainer}>
              <label style={styles.label}>Insurance Type</label>
              <div style={styles.readOnlyField}>
                <span style={styles.readOnlyText}>
                  {formatInsuranceType(insuranceType)}
                </span>
              </div>
            </div>

            <div style={styles.fieldContainer}>
              <label style={styles.label}>
                Policy Number <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                placeholder="Enter policy number"
                required
              />
            </div>

            <div style={styles.fieldContainer}>
              <label style={styles.label}>
                Sum Assured (₹) <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                type="number"
                value={sumAssured}
                onChange={(e) => setSumAssured(e.target.value)}
                placeholder="Enter sum assured"
                required
              />
            </div>

            <div style={styles.fieldContainer}>
              <label style={styles.label}>
                Premium Amount (₹) <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                type="number"
                value={premiumAmount}
                onChange={(e) => setPremiumAmount(e.target.value)}
                placeholder="Enter premium amount"
                required
              />
            </div>

            <div style={styles.divider} />

            <h3 style={styles.sectionTitle}>Nominee Details</h3>

            <div style={styles.fieldContainer}>
              <label style={styles.label}>Nominee Name</label>
              <input
                style={styles.input}
                type="text"
                value={nomineeName}
                onChange={(e) => setNomineeName(e.target.value)}
                placeholder="Enter nominee name"
              />
            </div>

            <div style={styles.fieldContainer}>
              <label style={styles.label}>Relationship</label>
              <input
                style={styles.input}
                type="text"
                value={nomineeRelationship}
                onChange={(e) => setNomineeRelationship(e.target.value)}
                placeholder="e.g., Spouse, Son, Daughter"
              />
            </div>

            <div style={styles.buttonContainer}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  ...styles.verifyButton,
                  ...(isLoading && styles.buttonDisabled),
                }}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify & Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    fontSize: 48,
    textAlign: "center",
    margin: "16px 0",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
    display: "block",
  },
  required: {
    color: "#E74C3C",
  },
  input: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },
  readOnlyField: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    border: "1px solid #e0e0e0",
  },
  readOnlyText: {
    fontSize: 16,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    margin: "20px 0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  buttonContainer: {
    display: "flex",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#666",
    padding: 16,
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 16,
    fontWeight: "600",
    cursor: "pointer",
  },
  verifyButton: {
    flex: 1,
    backgroundColor: "#4DB6AC",
    color: "#fff",
    padding: 16,
    borderRadius: 8,
    border: "none",
    fontSize: 16,
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonDisabled: {
    backgroundColor: "#A5D1CB",
    cursor: "not-allowed",
  },
  button: {
    backgroundColor: "#4DB6AC",
    color: "#fff",
    padding: 16,
    borderRadius: 8,
    border: "none",
    fontSize: 16,
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 40,
  },
};

export default PolicyVerificationScreen;
