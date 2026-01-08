/* My Policy Screen */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Grid,
} from "@mui/material";
import { Description } from "@mui/icons-material";
import AppHeader from "../components/AppHeader";
import Loading from "../components/common/Loading";
import { getPolicies } from "../services/policy";

const MyPolicyScreen = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState({
    health: [],
    life: [],
    unprocessed: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPolicies();
      setPolicies(data);
    } catch (err) {
      setError(err.message || "Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const renderPolicyCard = (policy) => (
    <Grid item xs={12} key={policy.id}>
      <Card
        onClick={() => navigate(`/policy-detail/${policy.id}`)}
        sx={{
          cursor: "pointer",
          transition: "all 0.3s",
          "&:hover": {
            boxShadow: 3,
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {policy.name}
            </Typography>
            <Box>
              {policy.is_expired && (
                <Chip
                  label="Expired"
                  color="error"
                  size="small"
                  sx={{ mr: 1 }}
                />
              )}
              {policy.ai_extraction_status === "PROCESSING" && (
                <Chip
                  label="Processing"
                  color="warning"
                  size="small"
                  sx={{ mr: 1 }}
                />
              )}
              {policy.ai_extraction_status === "FAILED" && (
                <Chip
                  label="Failed"
                  color="error"
                  size="small"
                  sx={{ mr: 1 }}
                />
              )}
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Policy Number
              </Typography>
              <Typography variant="body2">
                {policy.policy_number || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Insurer
              </Typography>
              <Typography variant="body2">
                {policy.insurer_name || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Sum Assured
              </Typography>
              <Typography variant="body2">
                ₹{policy.sum_assured || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Premium
              </Typography>
              <Typography variant="body2">
                ₹{policy.premium_amount || "N/A"}
              </Typography>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Chip
              label={policy.insurance_type}
              size="small"
              sx={{ backgroundColor: "#4DB6AC", color: "#fff" }}
            />
            <Typography variant="caption" color="text.secondary">
              Uploaded: {new Date(policy.uploaded_at).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  const getAllPolicies = () => {
    return [...policies.life, ...policies.health, ...policies.unprocessed];
  };

  const getFilteredPolicies = () => {
    switch (activeTab) {
      case 1:
        return policies.life;
      case 2:
        return policies.health;
      case 3:
        return policies.unprocessed;
      default:
        return getAllPolicies();
    }
  };

  const displayedPolicies = getFilteredPolicies();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader title="My Policies" showBack={false} />

      <Box sx={{ flex: 1, pb: 8 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Tab label={`All (${getAllPolicies().length})`} />
          <Tab label={`Life (${policies.life.length})`} />
          <Tab label={`Health (${policies.health.length})`} />
          <Tab label={`Pending (${policies.unprocessed.length})`} />
        </Tabs>

        <Container maxWidth="md" sx={{ mt: 3 }}>
          {loading ? (
            <Loading />
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : displayedPolicies.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Description sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No policies found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Upload your first policy to get started
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {displayedPolicies.map(renderPolicyCard)}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default MyPolicyScreen;
