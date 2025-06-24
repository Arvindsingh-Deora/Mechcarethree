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
        fetchUserProfile(currentUser.uid);
      } else {
        setLoadingProfile(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid) => {
    setLoadingProfile(true);
    try {
      console.log("Fetching profile for uid:", uid);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/get-profile/${uid}`);
      console.log("Profile fetch response status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched profile data:", data);
        setPhone(data?.phone || "");
        setVehicle(data?.vehicle || "");
        setLocation(data?.location || "");
        setIsEditing(!data);
      } else if (res.status === 404) {
        console.log("Profile not found (404), entering edit mode.");
        setIsEditing(true);
        setPhone("");
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
    if (!phone.trim()) {
      setError("Please enter a phone number.");
      return;
    }
    try {
      const profileData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        phone,
        vehicle,
        location,
      };
      console.log("Saving profile data:", profileData);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/save-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      console.log("Save profile response status:", res.status);
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
              <p><strong>Name:</strong> {user.displayName}</p>
              <p><strong>Email:</strong> {user.email}</p>
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
                  <p><strong>📞 Phone:</strong> {phone || "Not provided"}</p>
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
