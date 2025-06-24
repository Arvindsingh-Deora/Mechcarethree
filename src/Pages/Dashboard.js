// src/Pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../Style/Pages/Dashboard.css'; // uncomment if needed

const Dashboard = () => {
  const [userRequests, setUserRequests] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchRequests(currentUser.email);
      }
    });
  }, []);

  const fetchRequests = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/requests/user/${email}`);
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUserRequests(sorted);
    } catch (error) {
      console.error("Error fetching user requests:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Info Box */}
      <div className="info-box">
        <h3>🧾 Booking Status & Order History</h3>
        <p>This is where users can see their current booking status and past help request history.</p>
      </div>

      <h2>📋 My Help Requests</h2>

      {userRequests.length > 0 ? (
        userRequests.map((req) => (
          <div className="request-card" key={req._id}>
            <h3>🔧 {req.mechanicName}</h3>
            <p><strong>Problem:</strong> {req.problemDescription}</p>
            <p><strong>Location:</strong> {req.userLocation}</p>
            <p><strong>Status:</strong> {req.status}</p>
          </div>
        ))
      ) : (
        <p>No requests made yet.</p>
      )}
    </div>
  );
};

export default Dashboard;
