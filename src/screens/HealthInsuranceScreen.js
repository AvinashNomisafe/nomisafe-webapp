/* Health Insurance Screen */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AppHeader from "../components/AppHeader";
import {
  uploadPolicy,
  getPolicies,
  getExtractionStatus,
} from "../services/policy";

const HealthInsuranceScreen = () => {
  const navigate = useNavigate();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [healthPolicies, setHealthPolicies] = useState([]);
  const [unprocessedPolicies, setUnprocessedPolicies] = useState([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(true);
  const [pollingIntervals, setPollingIntervals] = useState({});
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPolicies();

    // Cleanup polling intervals on unmount
    return () => {
      Object.values(pollingIntervals).forEach(clearInterval);
    };
  }, []);

  const loadPolicies = async () => {
    try {
      setIsLoadingPolicies(true);
      const data = await getPolicies();

      // Filter for health insurance
      const healthActive = data.health || [];
      const unprocessed = data.unprocessed || [];

      setHealthPolicies(healthActive);
      setUnprocessedPolicies(unprocessed);

      // Start polling for policies with PENDING or PROCESSING status
      unprocessed.forEach((policy) => {
        if (
          policy.ai_extraction_status === "PENDING" ||
          policy.ai_extraction_status === "PROCESSING"
        ) {
          startPolling(policy.id);
        }
      });
    } catch (error) {
      console.error("Failed to load policies:", error);
      setError("Failed to load policies");
    } finally {
      setIsLoadingPolicies(false);
    }
  };

  const startPolling = (policyId) => {
    // Don't start if already polling
    if (pollingIntervals[policyId]) return;

    const interval = setInterval(async () => {
      try {
        const status = await getExtractionStatus(policyId);
        if (
          status.ai_extraction_status === "COMPLETED" ||
          status.ai_extraction_status === "FAILED"
        ) {
          clearInterval(interval);
          setPollingIntervals((prev) => {
            const newIntervals = { ...prev };
            delete newIntervals[policyId];
            return newIntervals;
          });
          loadPolicies(); // Refresh list
        }
      } catch (error) {
        console.error(`Failed to poll status for policy ${policyId}:`, error);
      }
    }, 30000); // Poll every 30 seconds

    setPollingIntervals((prev) => ({
      ...prev,
      [policyId]: interval,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please select a PDF file");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter insurance name");
      return;
    }

    if (!selectedFile) {
      alert("Please select a PDF file");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await uploadPolicy(name, selectedFile);

      alert(
        "Policy uploaded! AI is extracting details in the background. You can verify once complete."
      );
      setName("");
      setSelectedFile(null);
      setShowUploadForm(false);
      loadPolicies();
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload insurance policy.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPolicy = async (policy) => {
    if (
      policy.ai_extraction_status === "PENDING" ||
      policy.ai_extraction_status === "PROCESSING"
    ) {
      alert(
        "AI is still extracting policy details. This usually takes 1-2 minutes."
      );
      return;
    }

    if (policy.ai_extraction_status === "FAILED") {
      alert("Failed to extract policy details. Please try uploading again.");
      return;
    }

    try {
      const status = await getExtractionStatus(policy.id);
      if (status.extracted_data) {
        navigate("/verify-policy", {
          state: {
            policyId: policy.id,
            extractedData: status.extracted_data,
          },
        });
      }
    } catch (error) {
      alert("Failed to load extracted data");
    }
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const renderUnprocessedPolicyCard = (policy) => {
    const isProcessing =
      policy.ai_extraction_status === "PENDING" ||
      policy.ai_extraction_status === "PROCESSING";
    const isFailed = policy.ai_extraction_status === "FAILED";
    const isCompleted = policy.ai_extraction_status === "COMPLETED";

    return (
      <div key={policy.id} style={styles.unprocessedCard}>
        <div style={styles.policyHeader}>
          <div style={styles.policyName}>{policy.name}</div>
          {isProcessing && (
            <div style={styles.processingBadge}>
              <span style={styles.badgeText}>Processing...</span>
            </div>
          )}
          {isFailed && (
            <div style={styles.failedBadge}>
              <span style={styles.badgeText}>Failed</span>
            </div>
          )}
        </div>
        <div style={styles.uploadDate}>
          Uploaded: {new Date(policy.uploaded_at).toLocaleDateString("en-IN")}
        </div>

        {isCompleted && !policy.is_verified_by_user && (
          <button
            style={styles.verifyButton}
            onClick={() => handleVerifyPolicy(policy)}
          >
            Verify Details →
          </button>
        )}

        {isProcessing && (
          <div style={styles.statusText}>
            AI is extracting policy details. This may take 1-2 minutes.
          </div>
        )}

        {isFailed && (
          <div style={styles.errorText}>
            Failed to extract details. Please try uploading again.
          </div>
        )}
      </div>
    );
  };

  const renderPolicyCard = (policy) => {
    const isExpired = policy.is_expired;

    return (
      <div
        key={policy.id}
        style={{
          ...styles.policyCard,
          ...(isExpired ? styles.expiredCard : {}),
        }}
        onClick={() => navigate(`/policy/${policy.id}`)}
      >
        <div style={styles.policyHeader}>
          <div style={styles.policyName}>{policy.name}</div>
          {isExpired && (
            <div style={styles.expiredBadge}>
              <span style={styles.badgeText}>Expired</span>
            </div>
          )}
        </div>
        <div style={styles.policyNumber}>Policy No: {policy.policy_number}</div>
        <div style={styles.insurer}>{policy.insurer_name}</div>
        <div style={styles.policyDetails}>
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>Sum Assured</div>
            <div style={styles.detailValue}>
              {formatCurrency(policy.sum_assured)}
            </div>
          </div>
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>Premium</div>
            <div style={styles.detailValue}>
              {formatCurrency(policy.premium_amount)}
            </div>
          </div>
        </div>
        {policy.end_date && (
          <div style={styles.endDate}>
            Valid until: {new Date(policy.end_date).toLocaleDateString("en-IN")}
          </div>
        )}
      </div>
    );
  };

  if (showUploadForm) {
    return (
      <Layout>
        <AppHeader title="Health Insurance" showBack={false} />
        <div style={styles.content}>
          <button
            style={styles.backButton}
            onClick={() => setShowUploadForm(false)}
          >
            <span style={styles.backButtonText}>← Back to Policies</span>
          </button>

          <div style={styles.icon}>🏥</div>
          <h1 style={styles.pageTitle}>Upload Health Insurance</h1>

          <form style={styles.form} onSubmit={handleSubmit}>
            <label style={styles.label}>Insurance Name</label>
            <input
              type="text"
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter insurance name"
            />

            <label style={styles.label}>Policy Document (PDF)</label>
            <div style={styles.fileInputWrapper}>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={styles.fileInput}
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                style={{
                  ...styles.filePicker,
                  ...(selectedFile ? styles.fileSelected : {}),
                }}
              >
                {selectedFile ? selectedFile.name : "Select PDF File"}
              </label>
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonDisabled : {}),
              }}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload Policy"}
            </button>
          </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AppHeader title="Health Insurance" showBack={false} />
      <div style={styles.content}>
        <div style={styles.icon}>🏥</div>
        <h1 style={styles.pageTitle}>Health Insurance</h1>

        <button
          style={styles.addButton}
          onClick={() => setShowUploadForm(true)}
        >
          + Add Policy
        </button>

        {isLoadingPolicies ? (
          <div style={styles.loader}>Loading policies...</div>
        ) : (
          <>
            {unprocessedPolicies.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Pending Verification</h2>
                {unprocessedPolicies.map(renderUnprocessedPolicyCard)}
              </div>
            )}

            {healthPolicies.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Active Policies</h2>
                {healthPolicies.map(renderPolicyCard)}
              </div>
            )}

            {healthPolicies.length === 0 &&
              unprocessedPolicies.length === 0 && (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📄</div>
                  <div style={styles.emptyText}>
                    No health insurance policies yet
                  </div>
                  <div style={styles.emptySubtext}>
                    Click "Add Policy" to upload your first health insurance
                    policy
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  content: {
    padding: "20px",
    paddingBottom: "40px",
  },
  icon: {
    fontSize: "48px",
    textAlign: "center",
    margin: "16px 0",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "24px",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4DB6AC",
    color: "#fff",
    padding: "16px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    marginBottom: "24px",
  },
  loader: {
    marginTop: "40px",
    textAlign: "center",
    fontSize: "16px",
    color: "#666",
  },
  section: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "16px",
  },
  policyCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    borderLeft: "4px solid #4DB6AC",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  unprocessedCard: {
    backgroundColor: "#FFF9E6",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    borderLeft: "4px solid #FFA726",
  },
  expiredCard: {
    borderLeftColor: "#FF6B6B",
    opacity: 0.7,
  },
  policyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  policyName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  processingBadge: {
    backgroundColor: "#FFA726",
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "4px",
    paddingBottom: "4px",
    borderRadius: "4px",
  },
  failedBadge: {
    backgroundColor: "#FF6B6B",
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "4px",
    paddingBottom: "4px",
    borderRadius: "4px",
  },
  expiredBadge: {
    backgroundColor: "#FF6B6B",
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "4px",
    paddingBottom: "4px",
    borderRadius: "4px",
  },
  badgeText: {
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
  },
  uploadDate: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "12px",
  },
  verifyButton: {
    backgroundColor: "#4DB6AC",
    color: "#fff",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    marginTop: "8px",
  },
  statusText: {
    fontSize: "13px",
    color: "#FFA726",
    marginTop: "8px",
    fontStyle: "italic",
  },
  errorText: {
    fontSize: "13px",
    color: "#FF6B6B",
    marginTop: "8px",
    fontStyle: "italic",
  },
  policyNumber: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "4px",
  },
  insurer: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "12px",
  },
  policyDetails: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: "12px",
    color: "#999",
    marginBottom: "4px",
  },
  detailValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#000",
  },
  endDate: {
    fontSize: "12px",
    color: "#4DB6AC",
    marginTop: "8px",
  },
  emptyState: {
    textAlign: "center",
    marginTop: "60px",
    paddingLeft: "40px",
    paddingRight: "40px",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  emptyText: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  emptySubtext: {
    fontSize: "14px",
    color: "#666",
  },
  backButton: {
    background: "none",
    border: "none",
    marginBottom: "16px",
    cursor: "pointer",
    padding: 0,
  },
  backButtonText: {
    fontSize: "16px",
    color: "#4DB6AC",
    fontWeight: "600",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  label: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "8px",
    fontWeight: "500",
    display: "block",
  },
  input: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "16px",
    marginBottom: "20px",
    color: "#000",
    boxSizing: "border-box",
  },
  fileInputWrapper: {
    position: "relative",
    marginBottom: "24px",
  },
  fileInput: {
    display: "none",
  },
  filePicker: {
    display: "block",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    backgroundColor: "#f5f5f5",
    color: "#666",
    fontSize: "16px",
    textAlign: "center",
    cursor: "pointer",
  },
  fileSelected: {
    borderColor: "#4DB6AC",
    backgroundColor: "#E8F6F5",
  },
  button: {
    backgroundColor: "#4DB6AC",
    color: "#fff",
    padding: "16px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#A5D1CB",
    cursor: "not-allowed",
  },
};

export default HealthInsuranceScreen;
