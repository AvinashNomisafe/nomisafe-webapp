/* Home Screen */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import {
  Favorite,
  LocalHospital,
  Home,
  School,
  CheckCircle,
  ChevronRight,
} from "@mui/icons-material";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import ImageCarousel from "../components/ImageCarousel";
import { getProfile } from "../services/profile";
import { getPolicies, getDashboardStats } from "../services/policy";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [policyData, setPolicyData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 1 && !dashboardStats) {
      loadDashboardData();
    }
  }, [activeTab]);

  const loadData = async () => {
    try {
      setIsLoadingData(true);
      const [profileData, policies] = await Promise.all([
        getProfile().catch(() => null),
        getPolicies().catch(() => null),
      ]);
      setProfile(profileData);
      setPolicyData(policies);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      setIsLoadingDashboard(true);
      const stats = await getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const menuItems = [
    {
      id: 1,
      title: "Life Insurance",
      icon: <Favorite sx={{ fontSize: 40, color: "#E91E63" }} />,
      route: "/life-insurance",
    },
    {
      id: 2,
      title: "Health Insurance",
      icon: <LocalHospital sx={{ fontSize: 40, color: "#4CAF50" }} />,
      route: "/health-insurance",
    },
    {
      id: 3,
      title: "Properties",
      icon: <Home sx={{ fontSize: 40, color: "#FF9800" }} />,
      route: "/properties",
    },
    {
      id: 4,
      title: "Tutorials",
      icon: <School sx={{ fontSize: 40, color: "#9C27B0" }} />,
      route: "/tutorials",
    },
  ];

  const renderProgressChecklist = () => {
    const isProfileComplete = !!(
      profile?.profile?.name &&
      profile?.email &&
      profile?.profile?.date_of_birth
    );
    const hasHealthInsurance = (policyData?.health?.length || 0) > 0;
    const hasLifeInsurance = (policyData?.life?.length || 0) > 0;

    const completedSteps = [
      isProfileComplete,
      hasHealthInsurance,
      hasLifeInsurance,
    ].filter(Boolean).length;

    const totalSteps = 3;
    const progressPercentage = (completedSteps / totalSteps) * 100;

    const checklistItems = [
      {
        id: 1,
        text: "Complete your profile",
        completed: isProfileComplete,
        action: () => navigate("/profile"),
      },
      {
        id: 2,
        text: "Add your first Health Insurance",
        completed: hasHealthInsurance,
        action: () => navigate("/health-insurance"),
      },
      {
        id: 3,
        text: "Add your first Life Insurance",
        completed: hasLifeInsurance,
        action: () => navigate("/life-insurance"),
      },
    ];

    return (
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Pending Tasks
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <CheckCircle sx={{ color: "#4DB6AC", mr: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Getting Started
            </Typography>
          </Box>

          {checklistItems.map((item, index) => (
            <Box
              key={item.id}
              onClick={item.completed ? null : item.action}
              sx={{
                display: "flex",
                alignItems: "center",
                py: 1.5,
                borderBottom:
                  index < checklistItems.length - 1
                    ? "1px solid #f0f0f0"
                    : "none",
                cursor: item.completed ? "default" : "pointer",
                "&:hover": item.completed
                  ? {}
                  : { backgroundColor: "rgba(77, 182, 172, 0.05)" },
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: item.completed ? "#4DB6AC" : "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                {item.completed && (
                  <CheckCircle sx={{ fontSize: 16, color: "#fff" }} />
                )}
              </Box>
              <Typography
                sx={{
                  flex: 1,
                  textDecoration: item.completed ? "line-through" : "none",
                  color: item.completed ? "#999" : "#333",
                }}
              >
                {item.text}
              </Typography>
              {!item.completed && <ChevronRight sx={{ color: "#999" }} />}
            </Box>
          ))}

          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              {completedSteps} of {totalSteps} steps completed
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#4DB6AC",
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderMenuGrid = () => (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {menuItems.map((item) => (
          <Grid item xs={6} sm={3} key={item.id}>
            <Card
              onClick={() => navigate(item.route)}
              sx={{
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Box sx={{ mb: 1 }}>{item.icon}</Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {isLoadingData ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        renderProgressChecklist()
      )}
      <ImageCarousel />
    </Box>
  );

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const renderDashboard = () => {
    if (isLoadingDashboard) {
      return (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress size={48} />
          <Typography sx={{ mt: 2 }}>Loading your analytics...</Typography>
        </Box>
      );
    }

    if (!dashboardStats) {
      return (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No data available
          </Typography>
        </Box>
      );
    }

    const { summary, life_insurance, health_insurance } = dashboardStats;

    return (
      <Box>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #4DB6AC 0%, #26A69A 100%)",
                color: "#fff",
              }}
            >
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                  {summary.total_policies}
                </Typography>
                <Typography variant="body1">Total Policies</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)",
                color: "#fff",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {formatCurrency(summary.total_monthly_premium)}
                </Typography>
                <Typography variant="body1">Monthly Premium</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {life_insurance && life_insurance.total_policies > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Favorite sx={{ color: "#E91E63", mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Life Insurance
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Total Coverage
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(life_insurance.total_sum_assured)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Monthly Premium
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(life_insurance.total_premium)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {health_insurance && health_insurance.total_policies > 0 && (
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocalHospital sx={{ color: "#4CAF50", mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Health Insurance
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Total Coverage
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(health_insurance.total_sum_assured)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Monthly Premium
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(health_insurance.total_premium)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader title="NomiSafe" showMenu={true} />

      <Box sx={{ flex: 1, pb: 8 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          sx={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Tab label="Home" />
          <Tab label="Dashboard" />
        </Tabs>

        <Container maxWidth="md" sx={{ mt: 3 }}>
          {activeTab === 0 ? renderMenuGrid() : renderDashboard()}
        </Container>
      </Box>

      <BottomNavigation />
    </Box>
  );
};

export default HomeScreen;
