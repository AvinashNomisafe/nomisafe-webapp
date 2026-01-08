/* Side Menu Component */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import nomisafeBanner from "../assets/icons/Nomisafe_banner.png";
import HomeIcon from "@mui/icons-material/Home";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";

const SideMenu = ({ visible, onClose }) => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
    }
  }, [visible]);

  const menuItems = [
    {
      id: 1,
      title: "Home",
      icon: <HomeIcon style={{ color: "#4DB6AC", fontSize: 24 }} />,
      route: "/home",
    },
    {
      id: 2,
      title: "Service",
      icon: <BusinessCenterIcon style={{ color: "#4DB6AC", fontSize: 24 }} />,
      route: "/service",
    },
    {
      id: 3,
      title: "SafeVault",
      icon: <SecurityIcon style={{ color: "#4DB6AC", fontSize: 24 }} />,
      route: "/safe-vault",
    },
    {
      id: 4,
      title: "Profile",
      icon: <PersonIcon style={{ color: "#4DB6AC", fontSize: 24 }} />,
      route: "/profile",
    },
    {
      id: 5,
      title: "Health Insurance",
      icon: <LocalHospitalIcon style={{ color: "#4DB6AC", fontSize: 24 }} />,
      route: "/health-insurance",
    },
    {
      id: 6,
      title: "Life Insurance",
      icon: <FavoriteIcon style={{ color: "#4DB6AC", fontSize: 24 }} />,
      route: "/life-insurance",
    },
    {
      id: 7,
      title: "Properties",
      icon: <HomeWorkIcon style={{ color: "#4DB6AC", fontSize: 24 }} />,
      route: "/properties",
    },
    {
      id: 8,
      title: "Tutorials",
      icon: <SchoolIcon style={{ color: "#4DB6AC", fontSize: 24 }} />,
      route: "/tutorials",
    },
  ];

  const handleNavigation = (route) => {
    onClose();
    setTimeout(() => {
      navigate(route);
    }, 200);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!visible) return null;

  return (
    <div style={styles.portalContainer}>
      {/* Backdrop */}
      <div
        style={{
          ...styles.backdrop,
          opacity: isAnimating ? 1 : 0,
        }}
        onClick={handleClose}
      />

      {/* Menu Container */}
      <div
        style={{
          ...styles.menuContainer,
          transform: isAnimating ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Header */}
        <div style={styles.menuHeader}>
          <img src={nomisafeBanner} alt="Nomisafe" style={styles.logo} />
          <button style={styles.closeButton} onClick={handleClose}>
            <CloseIcon style={{ fontSize: 28, color: "#333" }} />
          </button>
        </div>

        {/* Menu Items */}
        <div style={styles.menuItemsContainer}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              style={styles.menuItem}
              onClick={() => handleNavigation(item.route)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F5F5F5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span style={styles.menuIcon}>{item.icon}</span>
              <span style={styles.menuItemText}>{item.title}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={styles.menuFooter}>
          <span style={styles.footerText}>NomiSafe v1.0</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  portalContainer: {
    position: "fixed",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: 600,
    height: "100vh",
    pointerEvents: "none",
    zIndex: 999,
    overflow: "hidden",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    transition: "opacity 0.3s ease-in-out",
    pointerEvents: "auto",
  },
  menuContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "min(280px, 75%)",
    backgroundColor: "#FFFFFF",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.25)",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.35s ease-in-out",
    pointerEvents: "auto",
  },
  menuHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
    borderBottom: "1px solid #E0E0E0",
  },
  logo: {
    width: 120,
    height: 40,
    objectFit: "contain",
  },
  closeButton: {
    padding: 5,
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemsContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    overflowY: "auto",
  },
  menuItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #F0F0F0",
    background: "none",
    border: "none",
    width: "100%",
    cursor: "pointer",
    transition: "background-color 0.2s",
    textAlign: "left",
  },
  menuIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  menuFooter: {
    padding: 20,
    borderTop: "1px solid #E0E0E0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
};

export default SideMenu;
