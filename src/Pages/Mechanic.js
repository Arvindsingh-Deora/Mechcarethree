// src/Pages/Mechanic.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Style/Pages/Mechanic.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase';

const Mechanic = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [mechanics, setMechanics] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [problemDescription, setProblemDescription] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    ownerName: '',
    shopName: '',
    address: '',
    gst: '',
    phone: '',
    city: '',
    photo: '',
    services: '',
    prices: ''
  });

  useEffect(() => {
    fetchMechanics();
    onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
    });
  }, []);

 const fetchMechanics = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/mechanics`);
    setMechanics(res.data);
  } catch (err) {
    console.error("Failed to fetch mechanics", err);
  }
};

const handleInputChange = (e) => {
  const { name, value, files } = e.target;
  if (name === "photo") {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    if (files && files[0]) reader.readAsDataURL(files[0]);
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/mechanics/register`, formData);
    setFormVisible(false);
    setFormData({
      ownerName: '', shopName: '', address: '', gst: '',
      phone: '', city: '', photo: '', services: '', prices: ''
    });
    setSuccessMessage("✅ Mechanic registered successfully!");
    fetchMechanics();
    setTimeout(() => setSuccessMessage(''), 3000);
  } catch (error) {
    console.error("Failed to register mechanic", error);
    alert("❌ Failed to register mechanic. Please try again.");
  }
};

const handleRequest = (shop) => {
  setSelectedMechanic(shop);
};

  const submitHelpRequest = async () => {
    if (!currentUser) return alert("⚠️ Please login first.");

    try {
      const data = {
        mechanicId: selectedMechanic._id,
        mechanicName: selectedMechanic.shopName,
        userLocation,
        problemDescription,
        userEmail: currentUser.email,
        userName: currentUser.displayName || "Guest",
        userPhone: currentUser.phoneNumber || "Not Provided"
      };

      await axios.post("${process.env.REACT_APP_BACKEND_URL}/api/requests", data);
      alert("✅ Help request sent to mechanic!");
      setSelectedMechanic(null);
      setProblemDescription('');
      setUserLocation('');
    } catch (err) {
      console.error("Error sending request", err);
      alert("❌ Failed to send request.");
    }
  };

  return (
    <div className="mechanic-page">
      <h2>Registered Mechanic Shops</h2>

      {successMessage && <div className="success-popup">{successMessage}</div>}

      <button className="register-btn" onClick={() => setFormVisible(!formVisible)}>
        {formVisible ? "Close Form" : "Register a Shop"}
      </button>

      {formVisible && (
        <form className="register-form" onSubmit={handleFormSubmit}>
          <input type="text" name="ownerName" placeholder="Owner Name" value={formData.ownerName} onChange={handleInputChange} required />
          <input type="text" name="shopName" placeholder="Shop Name" value={formData.shopName} onChange={handleInputChange} required />
          <input type="text" name="address" placeholder="Shop Address" value={formData.address} onChange={handleInputChange} required />
          <input type="text" name="gst" placeholder="GST Number" value={formData.gst} onChange={handleInputChange} />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required />
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
          <input type="text" name="services" placeholder="Services (e.g., Oil Change)" value={formData.services} onChange={handleInputChange} required />
          <input type="text" name="prices" placeholder="Prices (e.g., ₹500)" value={formData.prices} onChange={handleInputChange} required />
          <input type="file" name="photo" accept="image/*" onChange={handleInputChange} />
          <button type="submit">Submit</button>
        </form>
      )}

      <div className="shop-list">
        {mechanics.map((shop, index) => (
          <div className="shop-card" key={index}>
            {shop.photo && <img src={shop.photo} alt="Shop" className="shop-photo" />}
            <h3>{shop.shopName}</h3>
            <p><strong>Owner:</strong> {shop.ownerName}</p>
            <p><strong>Address:</strong> {shop.address}</p>
            <p><strong>Phone:</strong> {shop.phone}</p>
            <p><strong>City:</strong> {shop.city}</p>
            <p><strong>GST:</strong> {shop.gst}</p>
            <p><strong>🛠️ Services:</strong> {shop.services}</p>
            <p><strong>💰 Prices:</strong> {shop.prices}</p>
            <button className="request-btn" onClick={() => handleRequest(shop)}>Request Help</button>
          </div>
        ))}
      </div>

      {selectedMechanic && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Help Request to {selectedMechanic.shopName}</h3>
            <textarea
              placeholder="Describe your vehicle problem..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              rows={4}
            />
            <input
              type="text"
              placeholder="Your Location"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
            />
            <button onClick={submitHelpRequest}>Send Request</button>
            <button onClick={() => setSelectedMechanic(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mechanic;
