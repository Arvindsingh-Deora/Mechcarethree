import React, { useEffect, useState } from "react";
import "../Style/Pages/Track.css";

const Track = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Location error:", err);
        alert("❌ Location permission denied. Map may not show properly.");
      }
    );
  }, []);

  useEffect(() => {
    if (!window.google || !userLocation) return;

    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: userLocation,
      zoom: 14,
    });

    setMapInstance(map);

    // User Marker
    const userMarker = new window.google.maps.Marker({
      position: userLocation,
      map,
      title: "Your Location",
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    });

    // Places API: Nearby Search
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: userLocation,
      radius: 10000, // 5km
      keyword: 'mechanic',
      type: 'car_repair',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place) => {
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map,
            title: place.name,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div>
                <h3>${place.name}</h3>
                <p><strong>Rating:</strong> ${place.rating || "N/A"}</p>
                <p><strong>Address:</strong> ${place.vicinity}</p>
                <button id="dir-btn-${place.place_id}" style="margin-top:5px;">📍 Get Directions</button>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);

            window.google.maps.event.addListenerOnce(infoWindow, "domready", () => {
              const btn = document.getElementById(`dir-btn-${place.place_id}`);
              if (btn) {
                btn.addEventListener("click", () => {
                  getDirections(userLocation, place.geometry.location, map);
                });
              }
            });
          });
        });
      } else {
        console.error("Places request failed:", status);
        alert("❌ Could not fetch nearby mechanics.");
      }
    });
  }, [userLocation]);

  const getDirections = (origin, destination, map) => {
    const directionsService = new window.google.maps.DirectionsService();
    if (directionsRenderer) directionsRenderer.setMap(null);

    const newRenderer = new window.google.maps.DirectionsRenderer();
    newRenderer.setMap(map);
    setDirectionsRenderer(newRenderer);

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          newRenderer.setDirections(result);
          const route = result.routes[0].legs[0];
          setDistanceInfo(`${route.distance.text} away, takes ${route.duration.text}`);
        } else {
          alert("❌ Directions request failed: " + status);
        }
      }
    );
  };

  return (
    <div className="track-container">
      <h2>🗺️ Mechanic Tracker</h2>
      {distanceInfo && (
        <div className="info-panel">
          📏 Distance & Time: <strong>{distanceInfo}</strong>
        </div>
      )}
      <div id="map" style={{ height: "80vh", width: "100%", borderRadius: "12px" }}></div>
    </div>
  );
};

export default Track;
