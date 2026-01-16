/**
 * API Configuration
 *
 * Easy switching between Development and Production environments
 *
 * TO SWITCH ENVIRONMENTS:
 * 1. Change DEVICE_TYPE below to 'DEVELOPMENT' or 'PRODUCTION'
 * 2. For DEVELOPMENT: Update LOCAL_API_URL if needed
 */

// ============================================
// CHANGE THIS TO SWITCH ENVIRONMENTS
// ============================================
export const DEVICE_TYPE = "PRODUCTION"; // 'DEVELOPMENT' or 'PRODUCTION'

// API URLs
const LOCAL_API_URL = "https://api.nomisafe.in/api";
const PRODUCTION_API_URL = "https://api.nomisafe.in/api";
// ============================================

// Get base URL based on environment
const getBaseURL = () => {
  if (DEVICE_TYPE === "PRODUCTION") {
    return PRODUCTION_API_URL;
  }
  return LOCAL_API_URL;
};

export const API_BASE_URL = getBaseURL();
export const API_TIMEOUT = DEVICE_TYPE === "PRODUCTION" ? 30000 : 60000;
export const UPLOAD_TIMEOUT_MS = DEVICE_TYPE === "PRODUCTION" ? 180000 : 300000;
export const ENVIRONMENT =
  DEVICE_TYPE === "PRODUCTION" ? "production" : "development";

// Log current configuration
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📡 API CONFIGURATION");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`Device Type: ${DEVICE_TYPE}`);
console.log(`Base URL: ${API_BASE_URL}`);
console.log(`Timeout: ${API_TIMEOUT}ms`);
console.log(`Upload Timeout: ${UPLOAD_TIMEOUT_MS}ms`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// Logging helper
export const logAPICall = (endpoint, method) => {
  console.log(`[${DEVICE_TYPE}] ${method} ${API_BASE_URL}${endpoint}`);
};
