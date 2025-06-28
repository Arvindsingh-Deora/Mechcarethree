// src/Pages/Login.js
import React, { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  getAuth
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("mechcare_phone");
    if (stored) navigate("/Dashboard");
  }, [navigate]);

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      alert(`✅ Welcome ${result.user.displayName}`);
      navigate("/Dashboard");
    } catch (error) {
      alert("❌ Google login failed: " + error.message);
    }
  };

  // ✅ Setup Invisible reCAPTCHA
  const setupInvisibleRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier("send-otp-btn", {
        size: "invisible",
        callback: (response) => {
          console.log("Invisible reCAPTCHA solved:", response);
          sendOTP();
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired. Resetting...");
        },
      }, auth);
    }
  };

  const sendOTP = async () => {
    setOtpStatus("");
    if (!phone.startsWith("+91") || phone.length !== 13) {
      return setOtpStatus("❌ Enter valid +91 number");
    }

    setLoading(true);
    setupInvisibleRecaptcha();

    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setOtpStatus("✅ OTP sent to your phone!");
    } catch (err) {
      setOtpStatus("❌ Failed to send OTP: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || !confirmationResult) {
      return setOtpStatus("❌ Enter OTP");
    }

    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      localStorage.setItem("mechcare_phone", phone);
      alert("✅ OTP Verified!");
      navigate("/Dashboard");
    } catch (error) {
      setOtpStatus("❌ Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🔧 Welcome to MechCare</h2>
        <p>Login via Google or Phone OTP</p>

        <button className="login-button google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <hr />

        <input
          type="tel"
          placeholder="+91 Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button id="send-otp-btn" onClick={sendOTP} disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>

        {confirmationResult && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOTP} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {otpStatus && (
          <p
            style={{
              marginTop: "10px",
              color: otpStatus.includes("❌") ? "red" : "green",
            }}
          >
            {otpStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
