/* Auth Service - API calls for authentication */

import axios from "axios";
import {
  getAuthData,
  storeAuthData,
  clearAuthData,
} from "../utils/authStorage";
import { API_BASE_URL, API_TIMEOUT } from "../config/api";

console.log("🚀 Auth Service Initialized");
console.log("🌐 API Base URL:", API_BASE_URL);

// Base axios instance for authenticated requests
export const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_TIMEOUT,
});

// Public API instance for non-authenticated requests
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_TIMEOUT,
});

// Add request interceptor to include access token
authApi.interceptors.request.use(async (config) => {
  try {
    const authData = await getAuthData();
    if (authData.accessToken) {
      config.headers.Authorization = `Bearer ${authData.accessToken}`;
    }
    return config;
  } catch (error) {
    return config;
  }
});

// Token refresh function
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await publicApi.post("/auth/token/refresh/", {
      refresh: refreshToken,
    });
    return {
      access: response.data.access,
      refresh: response.data.refresh || refreshToken,
    };
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Add response interceptor to handle token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(authApi(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const authData = await getAuthData();
      const newTokens = await refreshAccessToken(authData.refreshToken);

      if (newTokens) {
        await storeAuthData({
          ...authData,
          accessToken: newTokens.access,
          refreshToken: newTokens.refresh,
        });

        authApi.defaults.headers.Authorization = `Bearer ${newTokens.access}`;
        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;

        isRefreshing = false;
        onTokenRefreshed(newTokens.access);

        return authApi(originalRequest);
      } else {
        isRefreshing = false;
        await clearAuthData();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

/* API Functions */

// Request OTP
export const requestOTP = async (phoneNumber) => {
  try {
    const response = await publicApi.post("/auth/otp/request/", {
      phone_number: phoneNumber,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to request OTP:", error);
    throw new Error(
      error.response?.data?.error || "Failed to send OTP. Please try again."
    );
  }
};

// Verify OTP
export const verifyOTP = async (phoneNumber, otp) => {
  try {
    const response = await publicApi.post("/auth/otp/verify/", {
      phone_number: phoneNumber,
      otp: otp,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    throw new Error(
      error.response?.data?.error || "Invalid OTP. Please try again."
    );
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await authApi.get("/auth/profile/");
    return response.data;
  } catch (error) {
    console.error("Failed to get user profile:", error);
    throw new Error("Failed to load profile.");
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await authApi.put("/auth/profile/", profileData);
    return response.data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw new Error("Failed to update profile.");
  }
};

// Delete account
export const deleteAccount = async () => {
  try {
    await authApi.delete("/auth/delete-account/");
    await clearAuthData();
  } catch (error) {
    console.error("Failed to delete account:", error);
    throw new Error("Failed to delete account.");
  }
};

// Verify Aadhaar
export const verifyAadhaar = async (aadhaarNumber) => {
  try {
    const response = await authApi.post("/auth/verify-aadhaar/", {
      aadhaar_number: aadhaarNumber,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to verify Aadhaar:", error);
    throw new Error(
      error.response?.data?.error || "Aadhaar verification failed."
    );
  }
};
