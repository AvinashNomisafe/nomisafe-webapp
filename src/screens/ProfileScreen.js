/* Profile Screen */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AppHeader from "../components/AppHeader";
import { useAuth } from "../contexts/AuthContext";
import { getProfile, updateProfile } from "../services/profile";
import { deleteAccount } from "../services/auth";
import EditIcon from "@mui/icons-material/Edit";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getProfile();
      setProfile(data);

      // Populate form from nested profile data
      setName(data.profile?.name || "");
      setEmail(data.email || "");
      setDateOfBirth(data.profile?.date_of_birth || "");
      setAlternatePhone(data.profile?.alternate_phone || "");
    } catch (error) {
      console.error("Failed to load profile:", error);
      alert("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedProfile = await updateProfile({
        name: name || undefined,
        email: email || undefined,
        date_of_birth: dateOfBirth || undefined,
        alternate_phone: alternatePhone || undefined,
      });

      setProfile(updatedProfile);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to update profile";
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setName(profile.profile?.name || "");
      setEmail(profile.email || "");
      setDateOfBirth(profile.profile?.date_of_birth || "");
      setAlternatePhone(profile.profile?.alternate_phone || "");
    }
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      deleteAccount()
        .then(() => {
          alert("Your account has been deleted.");
          logout();
          navigate("/login");
        })
        .catch(() => {
          alert("Failed to delete account. Please try again.");
        });
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout()
        .then(() => {
          navigate("/login");
        })
        .catch((error) => {
          console.error("Logout error:", error);
          alert("Failed to logout. Please try again.");
        });
    }
  };

  if (!user) {
    return (
      <Layout>
        <AppHeader title="Profile" showBack={false} />
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>User not found</p>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <AppHeader title="Profile" showBack={false} />
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AppHeader title="Profile" showBack={false} />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Profile</h1>
          {!isEditing && (
            <button
              style={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              <EditIcon style={{ fontSize: 20, marginRight: 4 }} />
              <span style={styles.editButtonText}>Edit</span>
            </button>
          )}
        </div>

        {/* Phone Number - Read Only */}
        <div style={styles.section}>
          <div style={styles.label}>Phone Number</div>
          <div style={styles.value}>{profile?.phone_number}</div>
        </div>

        {/* Name */}
        <div style={styles.section}>
          <div style={styles.label}>Full Name</div>
          {isEditing ? (
            <input
              type="text"
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          ) : (
            <div style={styles.value}>{name || "Not provided"}</div>
          )}
        </div>

        {/* Email */}
        <div style={styles.section}>
          <div style={styles.label}>Email</div>
          {isEditing ? (
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          ) : (
            <div style={styles.value}>{email || "Not provided"}</div>
          )}
        </div>

        {/* Date of Birth */}
        <div style={styles.section}>
          <div style={styles.label}>Date of Birth</div>
          {isEditing ? (
            <input
              type="date"
              style={styles.input}
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          ) : (
            <div style={styles.value}>
              {dateOfBirth
                ? new Date(dateOfBirth).toLocaleDateString("en-IN")
                : "Not provided"}
            </div>
          )}
        </div>

        {/* Alternate Phone */}
        <div style={styles.section}>
          <div style={styles.label}>Alternate Phone Number</div>
          {isEditing ? (
            <input
              type="tel"
              style={styles.input}
              value={alternatePhone}
              onChange={(e) => setAlternatePhone(e.target.value)}
              placeholder="Enter alternate phone number"
            />
          ) : (
            <div style={styles.value}>{alternatePhone || "Not provided"}</div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing ? (
          <div style={styles.actionButtons}>
            <button
              style={styles.cancelButton}
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              style={{
                ...styles.saveButton,
                ...(isSaving ? styles.saveButtonDisabled : {}),
              }}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
            <button
              style={{ ...styles.logoutButton, marginBottom: 40 }}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  content: {
    padding: "20px",
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
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
    color: "#666",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000",
    margin: 0,
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #4DB6AC",
    cursor: "pointer",
    color: "#4DB6AC",
  },
  editButtonText: {
    color: "#4DB6AC",
    fontWeight: "600",
  },
  section: {
    marginBottom: "16px",
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  label: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
    fontWeight: "500",
  },
  value: {
    fontSize: "16px",
    color: "#000",
    fontWeight: "500",
  },
  input: {
    fontSize: "16px",
    color: "#000",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    backgroundColor: "#fff",
    width: "100%",
    boxSizing: "border-box",
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
    marginBottom: "40px",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    color: "#666",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#4DB6AC",
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  saveButtonDisabled: {
    backgroundColor: "#A5D1CB",
    cursor: "not-allowed",
  },
  logoutButton: {
    backgroundColor: "#FF5252",
    padding: "14px 16px",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "block",
    margin: "20px auto 0",
    minWidth: "200px",
  },
};

export default ProfileScreen;
