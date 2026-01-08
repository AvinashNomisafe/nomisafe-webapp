/* Bottom Navigation Component */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Paper,
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import { Home, Description, Build, Lock, Person } from "@mui/icons-material";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/home", icon: <Home /> },
    { name: "My Policy", path: "/my-policy", icon: <Description /> },
    { name: "Service", path: "/service", icon: <Build /> },
    { name: "Safe Vault", path: "/safe-vault", icon: <Lock /> },
    { name: "Profile", path: "/profile", icon: <Person /> },
  ];

  const currentIndex = navItems.findIndex(
    (item) => item.path === location.pathname
  );

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      elevation={8}
    >
      <MuiBottomNavigation
        value={currentIndex}
        onChange={(event, newValue) => {
          navigate(navItems[newValue].path);
        }}
        showLabels
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.name}
            icon={item.icon}
          />
        ))}
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;
