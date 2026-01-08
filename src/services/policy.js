/* Policy Service - API calls for policy management */

import { authApi } from "./auth";
import { UPLOAD_TIMEOUT_MS } from "../config/api";

/* API Functions */

// Get all policies
export const getPolicies = async () => {
  try {
    const response = await authApi.get("/policies/");
    return response.data;
  } catch (error) {
    console.error("Failed to get policies:", error);
    throw new Error("Failed to load policies.");
  }
};

// Get policy detail
export const getPolicyDetail = async (policyId) => {
  try {
    const response = await authApi.get(`/policies/${policyId}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to get policy detail:", error);
    throw new Error("Failed to load policy details.");
  }
};

// Upload policy
export const uploadPolicy = async (policyName, policyFile) => {
  try {
    const formData = new FormData();
    formData.append("name", policyName);
    formData.append("document", policyFile);

    const response = await authApi.post("/policies/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: UPLOAD_TIMEOUT_MS,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to upload policy:", error);
    throw new Error(error.response?.data?.error || "Failed to upload policy.");
  }
};

// Update policy
export const updatePolicy = async (policyId, policyData) => {
  try {
    const response = await authApi.put(`/policies/${policyId}/`, policyData);
    return response.data;
  } catch (error) {
    console.error("Failed to update policy:", error);
    throw new Error("Failed to update policy.");
  }
};

// Delete policy
export const deletePolicy = async (policyId) => {
  try {
    await authApi.delete(`/policies/${policyId}/`);
  } catch (error) {
    console.error("Failed to delete policy:", error);
    throw new Error("Failed to delete policy.");
  }
};

// Verify policy
export const verifyPolicy = async (policyId) => {
  try {
    const response = await authApi.post(`/policies/${policyId}/verify/`);
    return response.data;
  } catch (error) {
    console.error("Failed to verify policy:", error);
    throw new Error("Failed to verify policy.");
  }
};

// Get AI extraction status
export const getExtractionStatus = async (policyId) => {
  try {
    const response = await authApi.get(
      `/policies/${policyId}/extraction-status/`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get extraction status:", error);
    throw new Error("Failed to get extraction status.");
  }
};

// Get dashboard stats
export const getDashboardStats = async () => {
  try {
    const response = await authApi.get("/policies/dashboard-stats/");
    return response.data;
  } catch (error) {
    console.error("Failed to get dashboard stats:", error);
    throw new Error("Failed to load dashboard statistics.");
  }
};
