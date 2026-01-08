/* OTP Verification Screen */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { verifyOTP, requestOTP } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";

const OTPVerificationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const phoneNumber = location.state?.phoneNumber;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/login");
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phoneNumber, navigate]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyOTP(phoneNumber, otpString);

      await login({
        accessToken: response.access,
        refreshToken: response.refresh,
        userId: response.user_id,
        phoneNumber: phoneNumber,
        user: {
          userId: response.user_id,
          phoneNumber: phoneNumber,
          isAadhaarVerified: response.is_aadhaar_verified || false,
        },
      });

      navigate("/home");
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    setError("");

    try {
      await requestOTP(phoneNumber);
      setResendTimer(30);
      setCanResend(false);

      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #4DB6AC 0%, #00897B 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h3"
            sx={{ color: "white", fontWeight: 700, mt: 2 }}
          >
            Verify OTP
          </Typography>
        </Box>

        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            We've sent a 6-digit code to
            <br />
            <strong>+91 {phoneNumber}</strong>
          </Typography>

          <Box component="form" onSubmit={handleVerifyOTP}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1.5,
                mb: 3,
              }}
            >
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "24px",
                      fontWeight: 600,
                    },
                  }}
                  sx={{
                    width: 50,
                    "& input": {
                      padding: "16px 8px",
                    },
                  }}
                />
              ))}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Verify OTP"
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            {canResend ? (
              <Button
                onClick={handleResendOTP}
                disabled={loading}
                sx={{ textTransform: "none" }}
              >
                Resend OTP
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Resend OTP in {resendTimer}s
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OTPVerificationScreen;
