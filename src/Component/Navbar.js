import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Style/Component/Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("mechcare_phone");
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("mechcare_phone");
    setIsLoggedIn(!!loggedIn);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Mechcare</Link>
      </div>
      <button className="navbar-toggle" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
        {!isLoggedIn && (
          <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
        )}
        <li><Link to="/track" onClick={toggleMenu}>Track</Link></li>
        <li><Link to="/Subscrption" onClick={toggleMenu}>Subscription</Link></li>
        <li><Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link></li>
        <li><Link to="/mechanics" onClick={toggleMenu}>Mechanic List</Link></li>
        <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>
        <li><Link to="/mechanic-dashboard" onClick={toggleMenu}>Mechanic Dashboard</Link></li>
        <li><Link to="/payment" onClick={toggleMenu}>Payment</Link></li>
        <li><Link to="/tutorial" onClick={toggleMenu}>Tutorial</Link></li>

        {isLoggedIn && (
          <li>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
