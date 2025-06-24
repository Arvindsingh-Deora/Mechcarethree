import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Pages/Home.css";
import { FaUserPlus, FaBook, FaTools, FaInstagram, FaLinkedin, FaGlobe } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location && vehicleNumber) {
      localStorage.setItem("location", location);
      localStorage.setItem("vehicleNumber", vehicleNumber);
      navigate("/mechanics");
    } else {
      alert("Please enter both location and vehicle number.");
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Welcome to Mechcare</h1>
          <p>Your one-stop solution for instant vehicle repair. Find a mechanic in minutes!</p>
          <a href="#form-section" className="cta-button">Get Started Now</a>
        </div>
      </section>

      {/* Form Section */}
      <section id="form-section" className="form-section">
        <h2>Vehicle Broke Down? We've Got You!</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter your Vehicle Number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            required
          />
          <button type="submit">Search Mechanic</button>
        </form>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How Mechcare Works</h2>
        <div className="steps">
          <div className="step">
            <FaUserPlus className="step-icon" />
            <h3>Step 1: Open Account</h3>
            <p>Create your Mechcare account in seconds to access our services.</p>
          </div>
          <div className="step">
            <FaBook className="step-icon" />
            <h3>Step 2: Book Mechanic</h3>
            <p>Enter your location and vehicle details to find nearby mechanics.</p>
          </div>
          <div className="step">
            <FaTools className="step-icon" />
            <h3>Step 3: Repair Done</h3>
            <p>Our mechanic arrives in 15 minutes to fix your vehicle!</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial-carousel">
          <div className="testimonial-wrapper">
            <div className="testimonial">
              <p>"Mechcare saved my day! My car broke down, and a mechanic was at my location in 10 minutes!"</p>
              <span>- Priya Sharma</span>
            </div>
            <div className="testimonial">
              <p>"Super easy to use, and the mechanics are professional. Highly recommend!"</p>
              <span>- Rajesh Kumar</span>
            </div>
            <div className="testimonial">
              <p>"Best service ever! My bike was fixed in no time, and the price was fair."</p>
              <span>- Anjali Singh</span>
            </div>
            {/* Duplicate for seamless loop */}
            <div className="testimonial">
              <p>"Mechcare saved my day! My car broke down, and a mechanic was at my location in 10 minutes!"</p>
              <span>- Priya Sharma</span>
            </div>
            <div className="testimonial">
              <p>"Super easy to use, and the mechanics are professional. Highly recommend!"</p>
              <span>- Rajesh Kumar</span>
            </div>
            <div className="testimonial">
              <p>"Best service ever! My bike was fixed in no time, and the price was fair."</p>
              <span>- Anjali Singh</span>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="emergency-section">
        <h3>📞 Emergency Helpline</h3>
        <p>If you're in a low network area or facing trouble, call us directly:</p>
        <a className="call-btn" href="tel:+9118001234567">1800-123-4567</a>
      </section>

      {/* WhatsApp Button */}
      <a href="https://wa.me/919106607738" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
        💬 Chat with Us
      </a>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/mechanics">Mechanics</a>
          <a href="/profile">Profile</a>
          <a href="/tutorial">Tutorial</a>
          <a href="/track">Track</a>
        </div>
        <div className="footer-social">
          <a href="https://webnew-front.onrender.com/" target="_blank" rel="noopener noreferrer">
            <FaGlobe /> Website
          </a>
          <a href="https://www.instagram.com/arvind_deora_12/?hl=en" target="_blank" rel="noopener noreferrer">
            <FaInstagram /> Instagram
          </a>
          <a href="https://www.linkedin.com/in/arvindsingh-deora-043707223/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin /> LinkedIn
          </a>
        </div>
        <div className="footer-author">
          Made with ❤️ by <a href="https://www.linkedin.com/in/arvindsingh-deora-043707223/" target="_blank" rel="noopener noreferrer">Arvind Singh Deora</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;