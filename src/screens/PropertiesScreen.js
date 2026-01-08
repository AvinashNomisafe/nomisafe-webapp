/* Properties Screen */

import React from "react";
import Layout from "../components/Layout";
import AppHeader from "../components/AppHeader";

const PropertiesScreen = () => {
  return (
    <Layout>
      <AppHeader title="Properties" showBack={false} />
      <div style={styles.content}>
        <div style={styles.icon}>🏠</div>
        <h1 style={styles.title}>Properties</h1>
        <div style={styles.banner}>COMING SOON</div>
      </div>
    </Layout>
  );
};

const styles = {
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 200px)",
  },
  icon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "16px",
    margin: 0,
  },
  banner: {
    fontSize: "24px",
    color: "#4DB6AC",
    fontWeight: "600",
  },
};

export default PropertiesScreen;
