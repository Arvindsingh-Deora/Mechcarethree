// src/Pages/PhoneAuth.js
import React, { useState } from 'react';
import { auth } from './Firebase'; // ✅ Your Firebase.js file
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const PhoneAuth = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: () => sendOTP(),
      },
      auth
    );
  };

  const sendOTP = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      alert('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP');
    }
  };

  const verifyOTP = async () => {
    try {
      await confirmationResult.confirm(otp);
      alert('Phone number verified!');
      // ✅ Aage user ka profile bana sakte ho yahaan
    } catch (error) {
      alert('Invalid OTP');
    }
  };

  return (
    <div>
      <h2>Phone Authentication</h2>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91xxxxxxxxxx"
      />
      <button onClick={sendOTP}>Send OTP</button>

      <div id="recaptcha-container"></div>

      <br />
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={verifyOTP}>Verify OTP</button>
    </div>
  );
};

export default PhoneAuth;
