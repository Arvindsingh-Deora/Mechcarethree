import React, { useEffect, useState } from "react";
import { auth } from "../Pages/Firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const PhoneVerificationPopup = ({ onSuccess, onClose }) => {
  const [phone, setPhone] = useState("9106607738"); // test number
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth is not initialized");
      return;
    }

    // For local testing only
    auth.settings.appVerificationDisabledForTesting = true;

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("🔐 reCAPTCHA solved", response);
          },
          "expired-callback": () => {
            alert("reCAPTCHA expired. Please try again.");
          },
        },
        auth
      );

      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      }).catch((error) => {
        console.error("reCAPTCHA render error:", error);
      });
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, [auth]);

  const sendOTP = async () => {
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    if (!phone || phone.length < 10) return alert("📱 Enter a valid number");

    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      alert(`✅ OTP sent to ${formattedPhone}`);
    } catch (error) {
      console.error("❌ OTP send error:", error);
      alert("OTP send failed: " + error.message);
    }
  };

  const verifyOTP = async () => {
    if (!otp) return alert("📩 Enter OTP");
    try {
      await confirmationResult.confirm(otp);
      alert("🎉 Phone number verified!");
      onSuccess(phone);
    } catch (error) {
      alert("❌ Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="otp-popup">
      <div className="otp-card">
        <h3>📞 Phone Verification</h3>

        {!confirmationResult ? (
          <>
            <input
              type="tel"
              placeholder="Phone (e.g., 9106607738)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div id="recaptcha-container"></div>
            <button onClick={sendOTP}>Send OTP</button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOTP}>Verify OTP</button>
          </>
        )}

        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PhoneVerificationPopup;