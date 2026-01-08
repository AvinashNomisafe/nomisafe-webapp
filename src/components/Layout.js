import React from "react";

const Layout = ({ children, backgroundColor = "#F8F9FA" }) => {
  return <div style={{ ...styles.wrapper, backgroundColor }}>{children}</div>;
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    maxWidth: 600,
    margin: "0 auto",
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
  },
};

export default Layout;
