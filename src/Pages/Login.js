// src/Pages/Login.js


import React, { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../Pages/Firebase";
import { useNavigate } from "react-router-dom";
import "../Style/Login.css";
console.log("Backend URL: ", process.env.REACT_APP_BACKEND_URL);
const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
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

  // ✅ Send OTP using Msg91
  const sendOTP = async () => {
    setOtpStatus("");
    if (!phone.startsWith("+91") || phone.length !== 13) {
      return setOtpStatus("❌ Enter valid +91 number");
    }

    setLoading(true);
    try {
      const backendPhone = phone.replace("+91", "");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: backendPhone }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpStatus("✅ OTP sent to your phone!");
        setOtpSent(true);
      } else {
        setOtpStatus("❌ Failed: " + data.message);
      }
    } catch (err) {
      setOtpStatus("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP using Msg91
  const verifyOTP = async () => {
    if (!otp) return setOtpStatus("❌ Enter OTP");

    setLoading(true);
    try {
      const backendPhone = phone.replace("+91", "");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: backendPhone, otp }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("mechcare_phone", phone);
        alert("✅ OTP Verified!");
        navigate("/Dashboard");
      } else {
        setOtpStatus("❌ " + data.message);
      }
    } catch (err) {
      setOtpStatus("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🔧 Welcome to MechCare</h2>
        <p>Login via Google or Phone OTP</p>

        {/* Google Login */}
        <button className="login-button google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <hr />

        {/* Phone Login */}
        <input
          type="tel"
          placeholder="+91 Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={sendOTP} disabled={loading || otpSent}>
          {loading ? "Sending..." : otpSent ? "OTP Sent" : "Send OTP"}
        </button>

        {otpSent && (
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
