import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { requestOTP } from "../services/auth";
import phoneLoginImage from "../assets/images/phone_login_screen.png";

const PhoneLoginScreen = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleContinue = async () => {
    try {
      setError("");
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");

      if (!validatePhoneNumber(cleanPhoneNumber)) {
        setError("Please enter a valid 10-digit phone number");
        return;
      }

      setLoading(true);
      await requestOTP(cleanPhoneNumber);
      navigate("/otp-verification", {
        state: { phoneNumber: cleanPhoneNumber },
      });
    } catch (err) {
      const errorMessage =
        err.message || "Failed to send OTP. Please try again.";
      alert(errorMessage);
      console.error("OTP Request Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && phoneNumber.length === 10 && !loading) {
      handleContinue();
    }
  };

  return (
    <Layout backgroundColor="#ffffff">
      <div style={styles.container}>
        <div style={styles.logoWrap}>{/* Logo can be added here */}</div>
        <div style={styles.illustration}>
          <img
            src={phoneLoginImage}
            alt="Phone Login"
            style={styles.illustrationImage}
          />
        </div>

        <h1 style={styles.title}>Enter Mobile Number For LogIn</h1>
        <p style={styles.subtitle}>
          We will send an OTP on this number for verification
        </p>

        <div style={styles.inputRow}>
          <div style={styles.countryCode}>
            <span style={styles.countryText}>+91</span>
          </div>
          <input
            type="tel"
            style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
            placeholder="Enter mobile number"
            value={phoneNumber}
            onChange={(e) => {
              setError("");
              setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""));
            }}
            onKeyPress={handleKeyPress}
            maxLength={10}
            disabled={loading}
            autoFocus
          />
        </div>
        {error && <p style={styles.errorText}>{error}</p>}

        <button
          style={{
            ...styles.button,
            ...(loading || phoneNumber.length < 10
              ? styles.buttonDisabled
              : {}),
          }}
          onClick={handleContinue}
          disabled={loading || phoneNumber.length < 10}
        >
          <span style={styles.buttonText}>
            {loading ? "Sending..." : "GET OTP"}
          </span>
        </button>

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
    marginTop: 8,
  },
  illustration: {
    width: 220,
    height: 220,
    borderRadius: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  illustrationImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 0,
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  inputRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginBottom: 8,
  },
  countryCode: {
    width: 70,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: 8,
    marginRight: 8,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  countryText: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    border: "1px solid #ddd",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    fontSize: 16,
    outline: "none",
  },
  inputError: {
    borderColor: "#ff4d4f",
  },
  errorText: {
    color: "#ff4d4f",
    alignSelf: "flex-start",
    marginTop: 4,
    fontSize: 14,
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
  footer: {
    marginTop: 28,
    color: "#888",
  },
};

export default PhoneLoginScreen;
