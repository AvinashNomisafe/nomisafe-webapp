/* Auth Context - Authentication state management */

import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAuthData,
  storeAuthData,
  clearAuthData,
} from "../utils/authStorage";
import { authApi } from "../services/auth";
import { setAuthState } from "../store/authSlice";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAuth = await getAuthData();
        if (storedAuth.accessToken && storedAuth.userId) {
          setIsAuthenticated(true);
          setUserId(storedAuth.userId);
          setPhoneNumber(storedAuth.phoneNumber);
          setAccessToken(storedAuth.accessToken);
          setRefreshToken(storedAuth.refreshToken);

          dispatch(
            setAuthState({
              isAuthenticated: true,
              accessToken: storedAuth.accessToken,
              refreshToken: storedAuth.refreshToken,
              userId: storedAuth.userId,
              phoneNumber: storedAuth.phoneNumber,
              isAadhaarVerified: storedAuth.user?.isAadhaarVerified || false,
            })
          );

          if (storedAuth.accessToken) {
            authApi.defaults.headers.Authorization = `Bearer ${storedAuth.accessToken}`;
          }

          if (storedAuth.user) {
            setUser(storedAuth.user);
          } else {
            setUser({
              userId: storedAuth.userId,
              phoneNumber: storedAuth.phoneNumber || "",
              isAadhaarVerified: false,
            });
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const interceptor = authApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          await logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      authApi.interceptors.response.eject(interceptor);
    };
  }, [dispatch]);

  const login = async (authData) => {
    try {
      const dataToStore = {
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        userId: authData.userId,
        phoneNumber: authData.phoneNumber,
        user: authData.user || {
          userId: authData.userId,
          phoneNumber: authData.phoneNumber,
          isAadhaarVerified: false,
        },
      };

      await storeAuthData(dataToStore);

      setIsAuthenticated(true);
      setUserId(authData.userId);
      setPhoneNumber(authData.phoneNumber);
      setAccessToken(authData.accessToken);
      setRefreshToken(authData.refreshToken);
      setUser(dataToStore.user);

      dispatch(
        setAuthState({
          isAuthenticated: true,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          userId: authData.userId,
          phoneNumber: authData.phoneNumber,
          isAadhaarVerified: dataToStore.user.isAadhaarVerified,
        })
      );

      authApi.defaults.headers.Authorization = `Bearer ${authData.accessToken}`;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearAuthData();

      setIsAuthenticated(false);
      setUserId(null);
      setPhoneNumber(null);
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);

      dispatch(
        setAuthState({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          userId: null,
          phoneNumber: null,
          isAadhaarVerified: false,
        })
      );

      delete authApi.defaults.headers.Authorization;
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const value = {
    isLoading,
    isAuthenticated,
    user,
    userId,
    phoneNumber,
    accessToken,
    refreshToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
