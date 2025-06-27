// src/Pages/Profile.js
import React, { useEffect, useState } from "react";
import { auth } from "../Pages/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import "../Style/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [location, setLocation] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [error, setError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      if (currentUser) {
        fetchUserProfile(currentUser.uid, currentUser);
      } else {
        setLoadingProfile(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid, currentUser) => {
    setLoadingProfile(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/get-profile/${uid}`);
      if (res.ok) {
        const data = await res.json();
        setPhone(data?.phone || currentUser?.phoneNumber || "");
        setVehicle(data?.vehicle || "");
        setLocation(data?.location || "");
        setIsEditing(!data);
      } else if (res.status === 404) {
        setIsEditing(true);
        setPhone(currentUser?.phoneNumber || "");
        setVehicle("");
        setLocation("");
      } else {
        console.error("Failed to fetch profile, status:", res.status);
        setIsEditing(true);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setIsEditing(true);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSave = async () => {
    if (!user) return alert("Please login first.");
    setError("");

    const finalPhone = phone || user.phoneNumber;
    if (!finalPhone.trim()) {
      setError("Please enter a phone number.");
      return;
    }

    try {
      const profileData = {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        phone: finalPhone,
        vehicle,
        location,
      };

      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/save-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) throw new Error(`Failed to save profile: ${res.status}`);

      alert("✅ Profile saved successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("❌ Could not save profile.");
    }
  };

  if (loadingProfile) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 User Profile</h2>
        {user ? (
          <>
            {user.photoURL && <img className="profile-img" src={user.photoURL} alt="Profile" />}
            <div className="profile-info">
              <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
              <p><strong>Email:</strong> {user.email || "N/A"}</p>
            </div>

            {isEditing ? (
              <>
                <div className="form-group">
                  <label>📞 Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label>🚗 Vehicle Number</label>
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="Enter vehicle number"
                  />
                </div>
                <div className="form-group">
                  <label>📍 Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                  />
                </div>
                {error && <p className="error-text">⚠️ {error}</p>}
                <button className="save-button" onClick={handleSave}>
                  💾 Save Profile
                </button>
              </>
            ) : (
              <>
                <div className="form-group">
                  <p><strong>📞 Phone:</strong> {phone || user.phoneNumber || "Not provided"}</p>
                  <p><strong>🚗 Vehicle:</strong> {vehicle || "Not provided"}</p>
                  <p><strong>📍 Location:</strong> {location || "Not provided"}</p>
                </div>
                <button className="edit-button" onClick={() => setIsEditing(true)}>
                  ✏️ Edit
                </button>
              </>
            )}

            {error && !isEditing && <p className="error-text">⚠️ {error}</p>}
          </>
        ) : (
          <p className="warning-text">⚠️ Please login to see your profile.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
