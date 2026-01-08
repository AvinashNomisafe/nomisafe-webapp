/* Profile Service - API calls for user profile */

import { authApi } from "./auth";

/* API Functions */

// Get user profile
export const getProfile = async () => {
  try {
    const response = await authApi.get("/profile/");
    return response.data;
  } catch (error) {
    console.error("Failed to get profile:", error);
    throw new Error("Failed to load profile.");
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await authApi.put("/profile/", profileData);
    return response.data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw new Error("Failed to update profile.");
  }
};

// Upload profile picture
export const uploadProfilePicture = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("profile_picture", imageFile);

    const response = await authApi.post("/auth/profile/picture/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to upload profile picture:", error);
    throw new Error("Failed to upload profile picture.");
  }
};
