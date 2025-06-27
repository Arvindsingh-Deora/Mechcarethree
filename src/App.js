import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import MechanicList from "./Pages/Mechanic";
import Profile from "./Pages/Profile";
import Tutorials from "./Pages/Tutorial";
import MechanicDashboard from "./Pages/MechanicDashboard";
import Login from "./Pages/Login"; // 👈 Add this
import Payment from "./Pages/Payment";
import Track from "./Pages/Track";
import Subscription from "./Pages/Subscription";
import PhoneAuth from "./Pages/PhoneAuth";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} /> {/* 👈 Add this */}
          <Route path="/PhoneAuth" element={<PhoneAuth/>} /> {/* 👈 Add this */}
          <Route path="/dashboard" element={<Dashboard />} />
          < Route path = "/Subscrption" element = { <Subscription />} />
          <Route path="/mechanics" element={<MechanicList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mechanic-Dashboard" element={<MechanicDashboard />} />
          <Route path="/Tutorial" element={<Tutorials />} />
          <Route path = "/Payment" element = { <Payment />} />
          <Route path = "/Track" element = {<Track />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
