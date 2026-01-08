/* Auth Storage Utility
 * Web version using localStorage
 */

const AUTH_STORAGE_KEY = "nomisafe_auth";

export const storeAuthData = async (authData) => {
  try {
    const dataToStore = JSON.stringify(authData);
    localStorage.setItem(AUTH_STORAGE_KEY, dataToStore);
  } catch (error) {
    console.error("Error storing auth data:", error);
    throw error;
  }
};

export const getAuthData = async () => {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      accessToken: null,
      refreshToken: null,
      userId: null,
      phoneNumber: null,
      user: null,
    };
  } catch (error) {
    console.error("Error getting auth data:", error);
    return {
      accessToken: null,
      refreshToken: null,
      userId: null,
      phoneNumber: null,
      user: null,
    };
  }
};

export const clearAuthData = async () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing auth data:", error);
    throw error;
  }
};
