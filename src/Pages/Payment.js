// src/Pages/Payment.js
import React, { useState } from 'react';
import axios from 'axios';
import '../Style/Pages/Payment.css';

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async () => {
    if (!amount || parseInt(amount) < 1) {
      return alert("⚠️ Please enter a valid amount");
    }

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const { data: order } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/payment/create-order`,
        { amount }
      );

      const options = {
        key: 'rzp_live_yWKNCbzWeK0Ddy', // Replace with real key for production
        amount: order.amount,
        currency: order.currency,
        name: 'MechCare Payment',
        description: 'Mechanic Booking Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/api/payment/verify-payment`,
              response
            );

            if (verifyRes.data.success) {
              setSuccessMessage('✅ Payment successful! Mechanic will be assigned shortly.');
            } else {
              setErrorMessage('❌ Payment verification failed.');
            }
          } catch (err) {
            console.error(err);
            setErrorMessage('❌ Error verifying payment.');
          }
        },
        prefill: {
          name: 'MechCare User',
          email: 'user@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#4a90e2'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      setErrorMessage('❌ Payment failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>🔧 Book a Mechanic</h2>
      <div className="payment-form">
        <label>Amount (₹)</label>
        <input
          type="number"
          placeholder="Enter Amount (e.g. 500)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="pay-button" onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "💸 Pay Now"}
        </button>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Payment;
