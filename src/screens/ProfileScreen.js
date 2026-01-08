/* Profile Screen */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import { Edit, Save, Cancel, Logout } from "@mui/icons-material";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import { useAuth } from "../contexts/AuthContext";
import { getProfile, updateProfile } from "../services/profile";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    date_of_birth: "",
    address: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setFormData({
        full_name: data.full_name || "",
        email: data.email || "",
        date_of_birth: data.date_of_birth || "",
        address: data.address || "",
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      await loadProfile();
      setEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/login");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader title="Profile" showBack={false} />

      <Box sx={{ flex: 1, pb: 8 }}>
        <Container maxWidth="md" sx={{ mt: 3 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "#4DB6AC",
                fontSize: 40,
                margin: "0 auto",
                mb: 2,
              }}
            >
              {formData.full_name
                ? formData.full_name.charAt(0).toUpperCase()
                : "U"}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {formData.full_name || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.phoneNumber || "No phone"}
            </Typography>
          </Box>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Personal Information
                </Typography>
                {!editing && (
                  <IconButton
                    onClick={() => setEditing(true)}
                    sx={{ color: "#4DB6AC" }}
                  >
                    <Edit />
                  </IconButton>
                )}
              </Box>

              {editing ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date_of_birth: e.target.value,
                        })
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      multiline
                      rows={3}
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                      >
                        Save Changes
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1">
                      {formData.full_name || "Not set"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {formData.email || "Not set"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body1">
                      {formData.date_of_birth || "Not set"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">
                      {formData.address || "Not set"}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>

          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </Container>
      </Box>

      <BottomNavigation />
    </Box>
  );
};

export default ProfileScreen;
