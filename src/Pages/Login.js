// src/Pages/Login.js
import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../Pages/Firebase";
import { useNavigate } from "react-router-dom";
import "../Style/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`🎉 Welcome ${user.displayName}`);
      navigate("/Dashboard");
    } catch (error) {
      console.error("❌ Google login failed:", error);
      alert("Login failed: " + error.message);
    }
  };

  // Setup Recaptcha
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => sendOTP(),
        },
        auth
      );
    }
  };

  // Send OTP
  const sendOTP = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      alert("📨 OTP sent to your phone!");
    } catch (error) {
      console.error("❌ Error sending OTP:", error);
      alert("Failed to send OTP: " + error.message);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    try {
      await confirmationResult.confirm(otp);
      alert("✅ Phone number verified!");
      navigate("/Dashboard");
    } catch (error) {
      console.error("❌ Invalid OTP:", error);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🔧 Welcome to MechCare</h2>
        <p>Login securely</p>

        {/* Google Login */}
        <button className="login-button google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <hr />

        {/* Phone Login */}
        <input
          type="tel"
          placeholder="📱 Enter Phone Number (+91...)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={sendOTP}>Send OTP</button>

        {confirmationResult && (
          <>
            <input
              type="text"
              placeholder="🔒 Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOTP}>Verify OTP</button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Login;
