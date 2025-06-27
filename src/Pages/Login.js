// src/Pages/Login.js
import React, { useState, useEffect } from "react";
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
  const [otpStatus, setOtpStatus] = useState("");
  const [sending, setSending] = useState(false); // avoid multiple clicks

  // 🔐 Google Login
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

  // ⚙️ Setup Recaptcha (only once)
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("✅ Recaptcha solved");
          },
          "expired-callback": () => {
            console.warn("⚠️ Recaptcha expired");
          },
        },
        auth
      );
    }
  };

  // 📲 Send OTP
  const sendOTP = async () => {
    setOtpStatus("");
    if (!phone.startsWith("+91") || phone.length !== 13) {
      setOtpStatus("❌ Please enter a valid phone number (+91...)");
      return;
    }

    setSending(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setOtpStatus("📨 OTP sent successfully!");
    } catch (error) {
      console.error("❌ Error sending OTP:", error);
      setOtpStatus("❌ Failed to send OTP: " + error.message);
    } finally {
      setSending(false);
    }
  };

  // ✅ Verify OTP
  const verifyOTP = async () => {
    if (!otp) {
      setOtpStatus("❌ Please enter the OTP first");
      return;
    }

    try {
      if (!confirmationResult) {
        setOtpStatus("❌ OTP not sent yet");
        return;
      }

      await confirmationResult.confirm(otp);
      alert("✅ Phone number verified!");
      navigate("/Dashboard");
    } catch (error) {
      console.error("❌ Invalid OTP:", error);
      setOtpStatus("❌ Invalid OTP, please try again.");
    }
  };

  // 🧹 Cleanup recaptcha when component unmounts
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🔧 Welcome to MechCare</h2>
        <p>Login securely</p>

        {/* 🔐 Google Login */}
        <button className="login-button google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <hr />

        {/* 📲 Phone OTP Login */}
        <input
          type="tel"
          placeholder="📱 Enter Phone Number (+91...)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={sendOTP} disabled={sending}>
          {sending ? "Sending..." : "Send OTP"}
        </button>

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

        {otpStatus && (
          <p style={{ marginTop: "10px", color: otpStatus.startsWith("❌") ? "red" : "green" }}>
            {otpStatus}
          </p>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Login;
