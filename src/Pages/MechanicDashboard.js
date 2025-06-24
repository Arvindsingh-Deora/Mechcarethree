import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../Style/Pages/MechanicDashboard.css";

const MechanicDashboard = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/requests`);
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRequests(sorted);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/requests/accept/${id}`);
      fetchRequests();
      alert("✅ Request Accepted! Mechanic is on the way.");
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/requests/reject/${id}`);
      fetchRequests();
      alert("❌ Request Rejected.");
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  return (
    <div className="dashboard">
      {/* Info Box */}
      <div className="info-box">
        <h3>🔧 Request Management Area</h3>
        <p>This is the place where mechanics accept or reject incoming service requests.</p>
      </div>

      <h2>📋 Incoming Help Requests</h2>

      {requests.length === 0 ? (
        <p>No help requests found.</p>
      ) : (
        requests.map((req) => (
          <div className="request-card" key={req._id}>
            <h3>👨‍🔧 Mechanic: {req.mechanicName}</h3>
            <p><strong>🧑 User Name:</strong> {req.userName}</p>
            <p><strong>📞 User Phone:</strong> {req.userPhone}</p>
            <p><strong>📧 User Email:</strong> {req.userEmail}</p>
            <p><strong>🛠 Problem:</strong> {req.problemDescription}</p>
            <p><strong>📍 Location:</strong> {req.userLocation}</p>
            <p><strong>📌 Status:</strong> {req.status}</p>

            {req.status === "Pending" && (
              <div className="actions">
                <button className="accept-btn" onClick={() => handleAccept(req._id)}>
                  ✅ Accept
                </button>
                <button className="reject-btn" onClick={() => handleReject(req._id)}>
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MechanicDashboard;
