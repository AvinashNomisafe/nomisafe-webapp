/* Home Screen */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AppHeader from "../components/AppHeader";
import { getProfile } from "../services/profile";
import { getPolicies, getDashboardStats } from "../services/policy";
import policyIcon from "../assets/icons/policy_icon.png";
import insuranceIcon from "../assets/icons/insurance_icon.png";
import propertiesIcon from "../assets/icons/properties_icon.png";
import tutorialsIcon from "../assets/icons/tutorials_icon.png";
import marketing1 from "../assets/images/marketing_1.png";
import marketing2 from "../assets/images/marketing_2.png";
import marketing3 from "../assets/images/marketing_3.png";
import ShieldIcon from "@mui/icons-material/Security";
import CashIcon from "@mui/icons-material/Payments";
import HeartPulseIcon from "@mui/icons-material/Favorite";
import MedicalBagIcon from "@mui/icons-material/MedicalServices";
import CalendarClockIcon from "@mui/icons-material/EventAvailable";
import ClockOutlineIcon from "@mui/icons-material/AccessTime";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChartIcon from "@mui/icons-material/BarChart";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [profile, setProfile] = useState(null);
  const [policyData, setPolicyData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [marketing1, marketing2, marketing3];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === "dashboard" && !dashboardStats) {
      loadDashboardData();
    }
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
      icon: policyIcon,
      route: "/life-insurance",
    },
    {
      id: 2,
      title: "Health Insurance",
      icon: insuranceIcon,
      route: "/health-insurance",
    },
    {
      id: 3,
      title: "Properties",
      icon: propertiesIcon,
      route: "/properties",
    },
    {
      id: 4,
      title: "Tutorials",
      icon: tutorialsIcon,
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
      <div style={styles.checklistBox}>
        <h3 style={styles.checklistTitle}>Pending Tasks</h3>
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.checkIcon}>✓</span>
            <span style={styles.progressTitle}>Getting Started</span>
          </div>

          {checklistItems.map((item, index) => (
            <div
              key={item.id}
              onClick={item.completed ? null : item.action}
              style={{
                ...styles.checklistItem,
                ...(index === checklistItems.length - 1
                  ? styles.checklistItemLast
                  : {}),
                cursor: item.completed ? "default" : "pointer",
              }}
            >
              <div
                style={{
                  ...styles.checklistIcon,
                  ...(item.completed
                    ? styles.checklistIconComplete
                    : styles.checklistIconIncomplete),
                }}
              >
                {item.completed && <span style={styles.checkIconSmall}>✓</span>}
              </div>
              <span
                style={{
                  ...styles.checklistText,
                  ...(item.completed ? styles.checklistTextComplete : {}),
                }}
              >
                {item.text}
              </span>
              {!item.completed && <span style={styles.chevronRight}>›</span>}
            </div>
          ))}

          <div style={styles.progressBar}>
            <span style={styles.progressBarLabel}>
              {completedSteps} of {totalSteps} steps completed
            </span>
            <div style={styles.progressBarTrack}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMenuGrid = () => (
    <>
      <div style={styles.menuGrid}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={styles.menuItem}
            onClick={() => navigate(item.route)}
          >
            <img
              src={item.icon}
              alt={item.title}
              style={styles.menuIconImage}
            />
            <span style={styles.menuTitle}>{item.title}</span>
          </div>
        ))}
      </div>
      <div style={styles.checklistContainer}>
        {isLoadingData ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} />
          </div>
        ) : (
          renderProgressChecklist()
        )}
      </div>
      <div style={styles.carouselContainer}>
        <img
          src={carouselImages[currentImageIndex]}
          alt="Marketing"
          style={styles.carouselImage}
        />
        <div style={styles.carouselDots}>
          {carouselImages.map((_, index) => (
            <div
              key={index}
              style={{
                ...styles.carouselDot,
                ...(index === currentImageIndex
                  ? styles.carouselDotActive
                  : {}),
              }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>
    </>
  );

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString("en-IN") || 0}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderDashboard = () => {
    if (isLoadingDashboard) {
      return (
        <div style={styles.dashboardContainer}>
          <h2 style={styles.dashboardTitle}>Dashboard</h2>
          <p style={styles.dashboardSubtitle}>
            Your financial overview and analytics
          </p>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading your analytics...</p>
          </div>
        </div>
      );
    }

    if (!dashboardStats) {
      return (
        <div style={styles.dashboardContainer}>
          <h2 style={styles.dashboardTitle}>Dashboard</h2>
          <p style={styles.dashboardSubtitle}>
            Your financial overview and analytics
          </p>
          <div style={styles.emptyStateContainer}>
            <ChartIcon style={{ fontSize: 64, color: "#ccc" }} />
            <p style={styles.emptyStateText}>No data available</p>
          </div>
        </div>
      );
    }

    const {
      summary,
      life_insurance,
      health_insurance,
      upcoming_renewals,
      recent_policies,
    } = dashboardStats;

    return (
      <div style={styles.dashboardContainer}>
        {/* Summary Cards */}
        <div style={styles.summaryGrid}>
          <div style={{ ...styles.summaryCard, ...styles.summaryCardPrimary }}>
            <ShieldIcon style={{ fontSize: 32, color: "#fff" }} />
            <span style={styles.summaryCardValue}>
              {summary?.total_policies || 0}
            </span>
            <span style={styles.summaryCardLabel}>Total Policies</span>
          </div>
          <div
            style={{ ...styles.summaryCard, ...styles.summaryCardSecondary }}
          >
            <CashIcon style={{ fontSize: 32, color: "#fff" }} />
            <span style={styles.summaryCardValue}>
              {formatCurrency(summary?.total_monthly_premium)}
            </span>
            <span style={styles.summaryCardLabel}>Monthly Premium</span>
          </div>
        </div>

        {/* Life Insurance Stats */}
        {life_insurance && life_insurance.total_policies > 0 && (
          <div style={styles.statsSection}>
            <div style={styles.statsSectionHeader}>
              <HeartPulseIcon style={{ fontSize: 24, color: "#E91E63" }} />
              <span style={styles.statsSectionTitle}>Life Insurance</span>
            </div>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Total Coverage</span>
                <span style={styles.statValue}>
                  {formatCurrency(life_insurance.total_sum_assured)}
                </span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Monthly Premium</span>
                <span style={styles.statValue}>
                  {formatCurrency(life_insurance.total_premium)}
                </span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Active Policies</span>
                <span style={styles.statValue}>
                  {life_insurance.active_policies}
                </span>
              </div>
              {life_insurance.total_maturity_amount > 0 && (
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Maturity Amount</span>
                  <span style={styles.statValue}>
                    {formatCurrency(life_insurance.total_maturity_amount)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Health Insurance Stats */}
        {health_insurance && health_insurance.total_policies > 0 && (
          <div style={styles.statsSection}>
            <div style={styles.statsSectionHeader}>
              <MedicalBagIcon style={{ fontSize: 24, color: "#4CAF50" }} />
              <span style={styles.statsSectionTitle}>Health Insurance</span>
            </div>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Total Coverage</span>
                <span style={styles.statValue}>
                  {formatCurrency(health_insurance.total_sum_assured)}
                </span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Monthly Premium</span>
                <span style={styles.statValue}>
                  {formatCurrency(health_insurance.total_premium)}
                </span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Active Policies</span>
                <span style={styles.statValue}>
                  {health_insurance.active_policies}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Renewals */}
        {upcoming_renewals && upcoming_renewals.length > 0 && (
          <div style={styles.renewalsSection}>
            <div style={styles.renewalsSectionHeader}>
              <CalendarClockIcon style={{ fontSize: 24, color: "#FF9800" }} />
              <span style={styles.renewalsSectionTitle}>Upcoming Renewals</span>
            </div>
            {upcoming_renewals.map((renewal) => (
              <div
                key={renewal.id}
                style={styles.renewalItem}
                onClick={() => navigate(`/policy/${renewal.id}`)}
              >
                <div style={styles.renewalItemLeft}>
                  <div style={styles.renewalItemName}>{renewal.name}</div>
                  <div style={styles.renewalItemInsurer}>
                    {renewal.insurer_name}
                  </div>
                  <div style={styles.renewalItemPremium}>
                    Premium: {formatCurrency(renewal.premium_amount)}
                  </div>
                </div>
                <div style={styles.renewalItemRight}>
                  <div
                    style={{
                      ...styles.renewalBadge,
                      ...(renewal.days_remaining <= 30
                        ? styles.renewalBadgeUrgent
                        : {}),
                    }}
                  >
                    {renewal.days_remaining} days
                  </div>
                  <div style={styles.renewalItemDate}>
                    {formatDate(renewal.end_date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Policies */}
        {recent_policies && recent_policies.length > 0 && (
          <div style={styles.recentSection}>
            <div style={styles.recentSectionHeader}>
              <ClockOutlineIcon style={{ fontSize: 24, color: "#2196F3" }} />
              <span style={styles.recentSectionTitle}>Recent Policies</span>
            </div>
            {recent_policies.map((policy) => (
              <div
                key={policy.id}
                style={styles.recentItem}
                onClick={() => navigate(`/policy/${policy.id}`)}
              >
                <div style={styles.recentItemLeft}>
                  <div
                    style={{
                      ...styles.recentItemIcon,
                      ...(policy.insurance_type === "LIFE"
                        ? styles.recentItemIconLife
                        : styles.recentItemIconHealth),
                    }}
                  >
                    {policy.insurance_type === "LIFE" ? (
                      <HeartPulseIcon style={{ fontSize: 20, color: "#fff" }} />
                    ) : (
                      <MedicalBagIcon style={{ fontSize: 20, color: "#fff" }} />
                    )}
                  </div>
                  <div>
                    <div style={styles.recentItemName}>{policy.name}</div>
                    <div style={styles.recentItemInsurer}>
                      {policy.insurer_name}
                    </div>
                  </div>
                </div>
                <div style={styles.recentItemRight}>
                  <div style={styles.recentItemAmount}>
                    {formatCurrency(policy.sum_assured)}
                  </div>
                  <ChevronRightIcon style={{ fontSize: 24, color: "#ccc" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout backgroundColor="#F8F9FA">
      <AppHeader showBackButton={false} showMenu={true} />

      <div style={styles.toggleContainer}>
        <button
          style={{
            ...styles.toggleButton,
            ...(activeTab === "home" ? styles.toggleButtonActive : {}),
          }}
          onClick={() => setActiveTab("home")}
        >
          <span
            style={{
              ...styles.toggleButtonText,
              ...(activeTab === "home" ? styles.toggleButtonTextActive : {}),
            }}
          >
            Home
          </span>
        </button>
        <button
          style={{
            ...styles.toggleButton,
            ...(activeTab === "dashboard" ? styles.toggleButtonActive : {}),
          }}
          onClick={() => setActiveTab("dashboard")}
        >
          <span
            style={{
              ...styles.toggleButtonText,
              ...(activeTab === "dashboard"
                ? styles.toggleButtonTextActive
                : {}),
            }}
          >
            Dashboard
          </span>
        </button>
      </div>

      <div style={styles.scrollView}>
        {activeTab === "home" ? renderMenuGrid() : renderDashboard()}
      </div>
    </Layout>
  );
};

const styles = {
  scrollView: {
    flex: 1,
  },
  toggleContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: "16px 16px 8px 16px",
    borderRadius: 12,
    padding: 4,
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  toggleButton: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 12,
    border: "none",
    background: "none",
    cursor: "pointer",
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: "#4DB6AC",
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  toggleButtonTextActive: {
    color: "#fff",
  },
  menuGrid: {
    display: "flex",
    flexWrap: "wrap",
    padding: 16,
    backgroundColor: "#fff",
  },
  menuItem: {
    width: "25%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
    cursor: "pointer",
  },
  menuIconImage: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 12,
    textAlign: "center",
  },
  checklistContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #4DB6AC",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  checklistBox: {
    marginTop: 16,
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  progressSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  progressHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
  },
  checkIcon: {
    fontSize: 24,
    color: "#4DB6AC",
    marginRight: 8,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  checklistItem: {
    display: "flex",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 12,
    borderBottom: "1px solid #F0F0F0",
  },
  checklistItemLast: {
    borderBottom: "none",
  },
  checklistIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checklistIconComplete: {
    backgroundColor: "#4CAF50",
  },
  checklistIconIncomplete: {
    backgroundColor: "#E0E0E0",
  },
  checkIconSmall: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  checklistText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  checklistTextComplete: {
    color: "#666",
    textDecoration: "line-through",
  },
  chevronRight: {
    fontSize: 20,
    color: "#999",
  },
  progressBar: {
    marginTop: 16,
    paddingTop: 16,
    borderTop: "1px solid #F0F0F0",
  },
  progressBarLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    display: "block",
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4DB6AC",
    borderRadius: 4,
    transition: "width 0.3s ease",
  },
  carouselContainer: {
    position: "relative",
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    height: 200,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  carouselDots: {
    position: "absolute",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 8,
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.5)",
    cursor: "pointer",
  },
  carouselDotActive: {
    backgroundColor: "#fff",
  },
  dashboardContainer: {
    padding: 20,
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  dashboardSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyStateContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 60,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
  },
  summaryGrid: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  summaryCardPrimary: {
    backgroundColor: "#4DB6AC",
  },
  summaryCardSecondary: {
    backgroundColor: "#FF9800",
  },
  summaryCardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 12,
    marginBottom: 4,
  },
  summaryCardLabel: {
    fontSize: 13,
    color: "#fff",
    opacity: 0.9,
  },
  statsSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  statsSectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
  },
  statsSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  statsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    width: "calc(50% - 6px)",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    display: "block",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    display: "block",
  },
  renewalsSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  renewalsSectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
  },
  renewalsSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  renewalItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 16,
    borderBottom: "1px solid #F0F0F0",
    cursor: "pointer",
  },
  renewalItemLeft: {
    flex: 1,
  },
  renewalItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  renewalItemInsurer: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  renewalItemPremium: {
    fontSize: 13,
    color: "#4DB6AC",
    fontWeight: "500",
  },
  renewalItemRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  renewalBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: "6px 12px",
    marginBottom: 6,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  renewalBadgeUrgent: {
    backgroundColor: "#FF5722",
  },
  renewalItemDate: {
    fontSize: 13,
    color: "#666",
  },
  recentSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  recentSectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
  },
  recentSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  recentItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 16,
    borderBottom: "1px solid #F0F0F0",
    cursor: "pointer",
  },
  recentItemLeft: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  recentItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentItemIconLife: {
    backgroundColor: "#E91E63",
  },
  recentItemIconHealth: {
    backgroundColor: "#4CAF50",
  },
  recentItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  recentItemInsurer: {
    fontSize: 14,
    color: "#666",
  },
  recentItemRight: {
    display: "flex",
    alignItems: "center",
  },
  recentItemAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4DB6AC",
    marginRight: 8,
  },
};

// Add spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default HomeScreen;
