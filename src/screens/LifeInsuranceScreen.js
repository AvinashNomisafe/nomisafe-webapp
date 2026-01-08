/* Life Insurance Screen */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AppHeader from "../components/AppHeader";
import {
  uploadPolicy,
  getPolicies,
  getPolicyDetail,
  getExtractionStatus,
} from "../services/policy";

const LifeInsuranceScreen = () => {
  const navigate = useNavigate();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [lifePolicies, setLifePolicies] = useState([]);
  const [unprocessedPolicies, setUnprocessedPolicies] = useState([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(true);
  const [pollingPolicyIds, setPollingPolicyIds] = useState(new Set());
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadPolicies = async () => {
    try {
      setIsLoadingPolicies(true);
      const data = await getPolicies();

      // Filter life insurance policies
      const allPolicies = data.life || [];
      const unprocessed = data.unprocessed || [];

      // For verified policies, filter by LIFE type
      // For unprocessed policies, show all (type not set until AI completes)
      const lifeOnly = allPolicies.filter(
        (p) => p.insurance_type === "LIFE" || p.policy_type === "LIFE"
      );

      setLifePolicies(lifeOnly);
      setUnprocessedPolicies(unprocessed);

      // Start polling for pending/processing policies
      const needsPolling = unprocessed.filter(
        (p) =>
          p.ai_extraction_status === "PENDING" ||
          p.ai_extraction_status === "PROCESSING"
      );
      if (needsPolling.length > 0) {
        const ids = new Set(needsPolling.map((p) => p.id));
        setPollingPolicyIds(ids);
        startPolling(ids);
      }
    } catch (error) {
      console.error("Failed to load policies:", error);
      alert("Failed to load policies");
    } finally {
      setIsLoadingPolicies(false);
    }
  };

  const startPolling = (policyIds) => {
    policyIds.forEach((id) => {
      const interval = setInterval(async () => {
        try {
          const status = await getExtractionStatus(id);
          if (
            status.ai_extraction_status === "COMPLETED" ||
            status.ai_extraction_status === "FAILED"
          ) {
            clearInterval(interval);
            setPollingPolicyIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(id);
              return newSet;
            });
            loadPolicies();
          }
        } catch (error) {
          console.error(`Failed to poll status for policy ${id}:`, error);
        }
      }, 30000);
    });
  };

  useEffect(() => {
    loadPolicies();
    setShowUploadForm(false);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please select a PDF file");
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
      alert(error.message || "Failed to upload insurance policy");
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
          <span style={styles.policyName}>{policy.name}</span>
          {isProcessing && (
            <span style={styles.processingBadge}>
              <span style={styles.spinner}>⟳</span> Processing...
            </span>
          )}
          {isFailed && <span style={styles.failedBadge}>Failed</span>}
        </div>
        <p style={styles.uploadDate}>
          Uploaded: {new Date(policy.uploaded_at).toLocaleDateString("en-IN")}
        </p>

        {isCompleted && !policy.is_verified_by_user && (
          <button
            style={styles.verifyButton}
            onClick={() => handleVerifyPolicy(policy)}
          >
            Verify Details →
          </button>
        )}

        {isProcessing && (
          <p style={styles.statusText}>
            AI is extracting policy details. This may take 1-2 minutes.
          </p>
        )}

        {isFailed && (
          <p style={styles.errorText}>
            Failed to extract details. Please try uploading again.
          </p>
        )}
      </div>
    );
  };

  const renderPolicyCard = (policy) => {
    return (
      <div
        key={policy.id}
        style={{
          ...styles.policyCard,
          ...(policy.is_expired && styles.expiredCard),
        }}
        onClick={() => navigate(`/policy/${policy.id}`)}
      >
        <div style={styles.policyHeader}>
          <span style={styles.policyName}>{policy.name}</span>
          {policy.is_expired && (
            <span style={styles.expiredBadge}>Expired</span>
          )}
        </div>
        <p style={styles.policyNumber}>Policy No: {policy.policy_number}</p>
        <p style={styles.insurer}>{policy.insurer_name}</p>
        <div style={styles.policyDetails}>
          <div style={styles.detailItem}>
            <p style={styles.detailLabel}>Sum Assured</p>
            <p style={styles.detailValue}>
              {formatCurrency(policy.sum_assured)}
            </p>
          </div>
          <div style={styles.detailItem}>
            <p style={styles.detailLabel}>Premium</p>
            <p style={styles.detailValue}>
              {formatCurrency(policy.premium_amount)}
            </p>
          </div>
        </div>
        {policy.end_date && (
          <p style={styles.endDate}>
            Valid until: {new Date(policy.end_date).toLocaleDateString("en-IN")}
          </p>
        )}
      </div>
    );
  };

  if (showUploadForm) {
    return (
      <Layout>
        <AppHeader showBackButton={false} showMenu={true} />
        <div style={styles.container}>
          <div style={styles.content}>
            <button
              style={styles.backButton}
              onClick={() => setShowUploadForm(false)}
            >
              ← Back to Policies
            </button>

            <div style={styles.iconContainer}>🛡️</div>
            <h1 style={styles.pageTitle}>Upload Life Insurance</h1>

            <form style={styles.form} onSubmit={handleSubmit}>
              <label style={styles.label}>Insurance Name</label>
              <input
                style={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter insurance name"
              />

              <label style={styles.label}>Policy Document (PDF)</label>
              <div style={styles.filePickerContainer}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  style={styles.fileInput}
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  style={{
                    ...styles.filePicker,
                    ...(selectedFile && styles.fileSelected),
                  }}
                >
                  {selectedFile ? selectedFile.name : "Select PDF File"}
                </label>
              </div>

              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...(isLoading && styles.buttonDisabled),
                }}
                disabled={isLoading}
              >
                {isLoading ? "Uploading..." : "Upload Policy"}
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AppHeader showBackButton={false} showMenu={true} />
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.iconContainer}>🛡️</div>
          <h1 style={styles.pageTitle}>Life Insurance</h1>

          <button
            style={styles.addButton}
            onClick={() => setShowUploadForm(true)}
          >
            + Add Policy
          </button>

          {isLoadingPolicies ? (
            <div style={styles.loader}>
              <div style={styles.spinner}>⟳</div>
              <p>Loading policies...</p>
            </div>
          ) : (
            <>
              {unprocessedPolicies.length > 0 && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Pending Verification</h2>
                  {unprocessedPolicies.map(renderUnprocessedPolicyCard)}
                </div>
              )}

              {lifePolicies.length > 0 && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Active Policies</h2>
                  {lifePolicies.map(renderPolicyCard)}
                </div>
              )}

              {lifePolicies.length === 0 &&
                unprocessedPolicies.length === 0 && (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📄</div>
                    <p style={styles.emptyText}>
                      No life insurance policies yet
                    </p>
                    <p style={styles.emptySubtext}>
                      Click "Add Policy" to upload your first life insurance
                      policy
                    </p>
                  </div>
                )}
            </>
          )}
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
    paddingBottom: 100,
  },
  iconContainer: {
    fontSize: 48,
    textAlign: "center",
    margin: "16px 0",
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#4DB6AC",
    padding: 16,
    borderRadius: 8,
    border: "none",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    marginBottom: 24,
  },
  loader: {
    marginTop: 40,
    textAlign: "center",
    color: "#666",
  },
  spinner: {
    display: "inline-block",
    animation: "spin 1s linear infinite",
    fontSize: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  policyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderLeft: "4px solid #4DB6AC",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  unprocessedCard: {
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
    marginBottom: 8,
  },
  policyName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  processingBadge: {
    backgroundColor: "#FFA726",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  failedBadge: {
    backgroundColor: "#FF6B6B",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  expiredBadge: {
    backgroundColor: "#FF6B6B",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  uploadDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  verifyButton: {
    backgroundColor: "#4DB6AC",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    border: "none",
    fontSize: 15,
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    marginTop: 8,
  },
  statusText: {
    fontSize: 13,
    color: "#FFA726",
    marginTop: 8,
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 13,
    color: "#FF6B6B",
    marginTop: 8,
    fontStyle: "italic",
  },
  policyNumber: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  insurer: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  policyDetails: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  endDate: {
    fontSize: 12,
    color: "#4DB6AC",
    marginTop: 8,
  },
  emptyState: {
    textAlign: "center",
    marginTop: 60,
    padding: "0 40px",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
  },
  backButton: {
    marginBottom: 16,
    backgroundColor: "transparent",
    border: "none",
    color: "#4DB6AC",
    fontSize: 16,
    fontWeight: "600",
    cursor: "pointer",
    padding: 8,
    textAlign: "left",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
    display: "block",
  },
  input: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    boxSizing: "border-box",
  },
  filePickerContainer: {
    marginBottom: 24,
  },
  fileInput: {
    display: "none",
  },
  filePicker: {
    display: "block",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  fileSelected: {
    borderColor: "#4DB6AC",
    backgroundColor: "#E8F6F5",
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
  },
  buttonDisabled: {
    backgroundColor: "#A5D1CB",
    cursor: "not-allowed",
  },
};

// Add CSS animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default LifeInsuranceScreen;
