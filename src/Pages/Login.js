import React, { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "./Firebase";
import { useNavigate } from "react-router-dom";
import "../Style/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpStatus, setOtpStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      alert(`🎉 Welcome ${result.user.displayName}`);
      navigate("/Dashboard");
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Login failed: " + err.message);
    }
  };

  // Setup reCAPTCHA (widget)
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "normal",
          callback: () => {
            console.log("✅ reCAPTCHA solved");
          },
          "expired-callback": () => {
            console.warn("⚠️ reCAPTCHA expired");
          },
        },
        auth
      );

      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  };

  // Send OTP
  const sendOTP = async () => {
    setOtpStatus("");
    if (!phone.startsWith("+91") || phone.length !== 13) {
      return setOtpStatus("❌ Please enter valid +91 phone number.");
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setOtpStatus("📨 OTP sent successfully!");
    } catch (err) {
      console.error("❌ OTP error:", err);
      setOtpStatus("❌ OTP not sent: " + err.message);
      try {
        window.recaptchaVerifier.render().then((widgetId) => {
          window.grecaptcha.reset(widgetId);
        });
      } catch (e) {
        console.warn("Couldn't reset reCAPTCHA:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!otp) return setOtpStatus("❌ Please enter the OTP.");
    if (!confirmationResult) return setOtpStatus("❌ OTP not sent yet.");

    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      alert("✅ Phone verified successfully!");
      navigate("/Dashboard");
    } catch (err) {
      console.error("❌ Invalid OTP:", err);
      setOtpStatus("❌ Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

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
          placeholder="📱 Enter Phone (+91...)"
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
              color: otpStatus.startsWith("❌") ? "red" : "green",
              marginTop: "10px",
              fontWeight: 500,
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
