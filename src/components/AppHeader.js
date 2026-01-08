/* App Header Component */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import nomisafeBanner from "../assets/icons/Nomisafe_banner.png";

const AppHeader = ({ showBackButton = true, showMenu = true }) => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  const handleBackPress = () => {
    navigate(-1);
  };

  return (
    <>
      <div style={styles.header}>
        {/* Left Section - Menu or Back Button */}
        <div style={styles.leftSection}>
          {showMenu && (
            <button style={styles.iconButton} onClick={handleMenuPress}>
              <span style={styles.menuIcon}>☰</span>
            </button>
          )}
          {showBackButton && (
            <button style={styles.iconButton} onClick={handleBackPress}>
              <span style={styles.backIcon}>←</span>
            </button>
          )}
        </div>

        {/* Center Section - Logo */}
        <div style={styles.centerSection}>
          <img src={nomisafeBanner} alt="Nomisafe" style={styles.bannerImage} />
        </div>

        {/* Right Section - Language & Notification */}
        <div style={styles.rightSection}>
          <button style={styles.iconButton}>
            <div style={styles.languageButton}>
              <span style={styles.translateIcon}>🌐</span>
            </div>
          </button>
          <button style={styles.iconButton}>
            <span style={styles.notificationIcon}>🔔</span>
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4DB6AC",
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 10,
    boxShadow: "0 2px 3px rgba(0,0,0,0.15)",
  },
  leftSection: {
    width: 80,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  centerSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rightSection: {
    width: 80,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  iconButton: {
    padding: 8,
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  menuIcon: {
    fontSize: 28,
    color: "#FFFFFF",
  },
  backIcon: {
    fontSize: 28,
    color: "#FFFFFF",
  },
  bannerImage: {
    width: 100,
    height: "auto",
  },
  languageButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 4,
  },
  translateIcon: {
    fontSize: 20,
  },
  notificationIcon: {
    fontSize: 24,
    color: "#FFFFFF",
  },
};

export default AppHeader;
