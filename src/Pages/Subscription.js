import React from 'react';
import '../Style/Pages/Subscription.css';

const Subscription = () => {
  return (
    <div className="subscription-container">
      <div className="coming-soon-banner">
        <h2>🚀 Upcoming Feature</h2>
        <p>Premium plans will be available soon. Stay tuned!</p>
      </div>

      <h1>✨ Go Premium with MechCare</h1>
      <p>Try ₹1 for 1 month. Cancel anytime. Auto-renews at your chosen plan.</p>

      <div className="plans">
        {/* Monthly Plan */}
        <div className="plan-card">
          <h2>Monthly</h2>
          <h3>₹49 / month</h3>
          <p className="trial-note">1 month free trial at ₹1</p>
          <ul>
            <li>✅ Priority Mechanic Booking</li>
            <li>✅ 0% Commission</li>
            <li>✅ Zero Ads Experience</li>
            <li>✅ Extra Service Discounts</li>
          </ul>
          <button className="subscribe-btn" disabled>
            Coming Soon
          </button>
        </div>

        {/* Yearly Plan */}
        <div className="plan-card recommended">
          <div className="tag">Best Value</div>
          <h2>Yearly</h2>
          <h3>₹499 / year</h3>
          <p className="trial-note">1 month free trial at ₹1</p>
          <ul>
            <li>✅ All Monthly Benefits</li>
            <li>✅ Save ₹89 yearly</li>
            <li>✅ Premium Support</li>
            <li>✅ VIP Early Access</li>
          </ul>
          <button className="subscribe-btn" disabled>
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
