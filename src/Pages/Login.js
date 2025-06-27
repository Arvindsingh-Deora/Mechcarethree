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
  const [loading, setLoading] = useState(false);

  // ✅ Google Sign-in
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      alert(`✅ Welcome, ${result.user.displayName}`);
      navigate("/Dashboard");
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
  };

  // ✅ Setup reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier && window.grecaptcha) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "normal",
          callback: () => {
            console.log("✅ reCAPTCHA passed");
          },
          "expired-callback": () => {
            console.log("⚠️ reCAPTCHA expired");
          },
        },
        auth
      );

      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  };

  // ✅ Send OTP
  const sendOTP = async () => {
    setOtpStatus("");
    if ( phone.length !== 10) {
      return setOtpStatus("❌ Please enter a valid +91 phone number.");
    }

    setLoading(true);
    setupRecaptcha();

    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setOtpStatus("✅ OTP sent successfully!");
    } catch (error) {
      setOtpStatus("❌ Failed to send OTP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const verifyOTP = async () => {
    if (!otp || !confirmationResult) {
      return setOtpStatus("❌ Please enter OTP after sending it.");
    }

    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      alert("✅ Phone verified successfully!");
      navigate("/Dashboard");
    } catch (error) {
      setOtpStatus("❌ Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Cleanup reCAPTCHA on component unmount
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
        <p>Login with Google or Phone</p>

        <button className="login-button google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <hr />

        <input
          type="tel"
          placeholder="📱 +91 Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={sendOTP} disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>

        {confirmationResult && (
          <>
            <input
              type="text"
              placeholder="🔒 Enter OTP"
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
              color: otpStatus.includes("❌") ? "red" : "green",
              marginTop: "10px",
            }}
          >
            {otpStatus}
          </p>
        )}

        <div id="recaptcha-container" style={{ marginTop: "15px" }}></div>
      </div>
    </div>
  );
};

export default Login;
