import React, { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
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
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // ✅ Google Login
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

  // ✅ Setup invisible reCAPTCHA tied to button
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "sign-in-button",
        {
          size: "invisible",
          callback: () => {
            console.log("✅ reCAPTCHA solved");
          },
          "expired-callback": () => {
            console.warn("⚠️ reCAPTCHA expired");
          },
        }
      );
    }
  };

  // ✅ Send OTP
  const sendOTP = async () => {
    setOtpStatus("");
    if (!phone.startsWith("+91") || phone.length !== 13) {
      setOtpStatus("❌ Please enter a valid phone number starting with +91");
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
      console.error("❌ OTP send error:", error);
      setOtpStatus("❌ Failed to send OTP: " + error.message);

      // 🔁 Reset reCAPTCHA if needed
      try {
        window.recaptchaVerifier.render().then((widgetId) => {
          window.grecaptcha.reset(widgetId);
        });
      } catch (e) {
        console.warn("Could not reset reCAPTCHA:", e);
      }
    } finally {
      setSending(false);
    }
  };

  // ✅ Verify OTP
  const verifyOTP = async () => {
    if (!otp) return setOtpStatus("❌ Please enter the OTP.");
    if (!confirmationResult) return setOtpStatus("❌ OTP not sent yet.");

    setVerifying(true);
    try {
      await confirmationResult.confirm(otp);
      alert("✅ Phone verified successfully!");
      navigate("/Dashboard");
    } catch (error) {
      console.error("❌ Invalid OTP:", error);
      setOtpStatus("❌ Invalid OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  // 🧹 Clear recaptcha on unmount
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
        <p>Login securely using Google or Phone</p>

        <button className="login-button google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <hr />

        {/* PHONE LOGIN */}
        <input
          type="tel"
          placeholder="📱 Enter Phone Number (+91...)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button id="sign-in-button" onClick={sendOTP} disabled={sending}>
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
            <button onClick={verifyOTP} disabled={verifying}>
              {verifying ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* OTP STATUS */}
        {otpStatus && (
          <p
            style={{
              marginTop: "10px",
              color: otpStatus.startsWith("❌") ? "red" : "green",
              fontWeight: 500,
            }}
          >
            {otpStatus}
          </p>
        )}

        <small style={{ color: "#888" }}>
          You'll receive an SMS for verification. Standard carrier rates may apply.
        </small>
      </div>
    </div>
  );
};

export default Login;
