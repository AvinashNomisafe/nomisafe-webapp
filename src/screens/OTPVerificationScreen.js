/* OTP Verification Screen */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { verifyOTP, requestOTP } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import phoneLoginImage from "../assets/images/phone_login_screen.png";

const OTPVerificationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const phoneNumber = location.state?.phoneNumber || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/login");
      return;
    }

    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, phoneNumber, navigate]);

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOTP(phoneNumber, otpString);

      await login({
        accessToken: response.access,
        refreshToken: response.refresh,
        userId: response.id,
        phoneNumber: response.phone_number,
      });

      const message = response.created
        ? "Account created and verified successfully!"
        : "Logged in successfully!";

      alert(message);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      const errorMessage =
        err.message || "Failed to verify OTP. Please try again.";
      setOtp(["", "", "", "", "", ""]);
      alert(errorMessage);
      inputRefs.current[0]?.focus();
      console.error("OTP Verification Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      setLoading(true);
      await requestOTP(phoneNumber.replace("+91", ""));
      setTimer(30);
      setCanResend(false);
      alert("OTP resent successfully");
    } catch (err) {
      const errorMessage =
        err.message || "Failed to resend OTP. Please try again.";
      alert(errorMessage);
      console.error("OTP Resend Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <Layout backgroundColor="#ffffff">
      <div style={styles.container}>
        <div style={styles.logoWrap}></div>

        <div style={styles.illustration}>
          <img
            src={phoneLoginImage}
            alt="OTP Verification"
            style={styles.illustrationImage}
          />
        </div>

        <h1 style={styles.title}>OTP Verification</h1>
        <p style={styles.subtitle}>Enter The OTP Sent To +91{phoneNumber}</p>

        <div style={styles.otpRow}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="tel"
              style={styles.otpBox}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={loading}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          style={{
            ...styles.button,
            ...(loading || otp.join("").length !== 6
              ? styles.buttonDisabled
              : {}),
          }}
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
        >
          <span style={styles.buttonText}>
            {loading ? "Verifying..." : "VERIFY & LOGIN"}
          </span>
        </button>

        <div style={styles.resendContainer}>
          {canResend ? (
            <button
              style={styles.resendButton}
              onClick={handleResendOTP}
              disabled={loading}
            >
              <span style={styles.resendText}>Resend OTP</span>
            </button>
          ) : (
            <p style={styles.timerText}>Resend OTP in {timer}s</p>
          )}
        </div>

        <p style={styles.footer}>Copyright © NOMISAFE 2025.</p>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: 24,
    maxWidth: 450,
    width: "100%",
    margin: "0 auto",
    backgroundColor: "#fff",
  },
  logoWrap: {
    marginBottom: 18,
  },
  illustration: {
    width: 220,
    height: 220,
    borderRadius: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  illustrationImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    paddingLeft: 30,
    paddingRight: 30,
  },
  otpRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
    gap: 8,
  },
  otpBox: {
    width: 50,
    height: 50,
    border: "1px solid #ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
    outline: "none",
  },
  button: {
    width: "100%",
    backgroundColor: "#4DB6AC",
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    border: "none",
    cursor: "pointer",
  },
  buttonDisabled: {
    backgroundColor: "#A5D1CB",
    cursor: "not-allowed",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  resendContainer: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
  },
  resendButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  resendText: {
    color: "#4DB6AC",
    fontSize: 16,
  },
  timerText: {
    color: "#666",
    fontSize: 16,
  },
  footer: {
    marginTop: 28,
    color: "#888",
  },
};

export default OTPVerificationScreen;
