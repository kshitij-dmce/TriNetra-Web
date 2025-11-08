import React, { useState } from "react";
import "./actionMonitoring.css";
import { MapPin, CheckCircle, Clock, Activity, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icon for map markers
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
  iconSize: [25, 25],
});

export default function ActionMonitoring() {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1); // Navigate back to previous page

  const [actions] = useState({
    high: 5,
    medium: 9,
    low: 15,
  });

  const highRiskAreas = [
    { area: "Airoli Bridge", risk: "Critical", pending: 3 },
    { area: "NH48 Junction", risk: "High", pending: 2 },
    { area: "Sector 12", risk: "Moderate", pending: 1 },
  ];

  const ongoingActions = [
    { id: "A01", title: "Flood Response", dept: "Disaster Mgmt", status: "In Progress", eta: "2 hrs" },
    { id: "A02", title: "Signal Repair", dept: "Traffic Control", status: "Under Review", eta: "1 hr" },
  ];

  const completedActions = [
    { id: "C01", title: "Accident Clearance", dept: "Emergency", completedAt: "09:45 AM" },
    { id: "C02", title: "Pothole Filling", dept: "Civic Works", completedAt: "08:20 AM" },
  ];

  const operationTimeline = [
    { time: "07:00 AM", event: "Alert Received: Flood Warning" },
    { time: "07:30 AM", event: "Response Unit Deployed" },
    { time: "08:15 AM", event: "Barricades Set Up at Sector 9" },
    { time: "09:00 AM", event: "Water Pumps Active" },
    { time: "09:45 AM", event: "Risk Level Lowered to Medium" },
  ];

  const mapMarkers = [
    { id: 1, lat: 19.118, lng: 72.905, label: "Sector 9 Operation" },
    { id: 2, lat: 19.132, lng: 72.915, label: "Airoli Bridge" },
  ];

  return (
    <div className="action-page">
      {/* Header */}
      <div className="action-header">
  <div className="action-header-left">
    <button className="back-btn" onClick={handleBack}>
      <ArrowLeft size={18} strokeWidth={2.5} />
    </button>
    <div>
      <h2>
        ⚙️ Action & Monitoring 
        {/* <span className="live-status">
          <span className="live-dot"></span> Live Active
        </span> */}
      </h2>
      <p>Track priority zones, ongoing operations, and completed interventions in real-time.</p>
    </div>
  </div>
</div>


      {/* Priority Section */}
      <section className="priority-section">
        <div className="priority-card high">
          <h3>High Priority</h3>
          <p>{actions.high}</p>
        </div>
        <div className="priority-card medium">
          <h3>Medium Priority</h3>
          <p>{actions.medium}</p>
        </div>
        <div className="priority-card low">
          <h3>Low Priority</h3>
          <p>{actions.low}</p>
        </div>
      </section>

      {/* Two-column Layout */}
      <div className="action-grid">
        <div className="action-card">
          <h3>High-Risk Areas</h3>
          <ul>
            {highRiskAreas.map((a, i) => (
              <li key={i}>
                <MapPin size={16} /> <strong>{a.area}</strong> — {a.risk} Risk, {a.pending} tasks pending
              </li>
            ))}
          </ul>
        </div>

        <div className="action-card">
          <h3>Ongoing Actions</h3>
          <ul>
            {ongoingActions.map((a) => (
              <li key={a.id}>
                <Activity size={16} /> {a.title} — <em>{a.dept}</em> ({a.status}, ETA: {a.eta})
              </li>
            ))}
          </ul>
        </div>

        <div className="action-card">
          <h3>Completed Actions</h3>
          <ul>
            {completedActions.map((a) => (
              <li key={a.id}>
                <CheckCircle size={16} color="#16a34a" /> {a.title} — {a.dept} ({a.completedAt})
              </li>
            ))}
          </ul>
        </div>

        <div className="action-card timeline-card">
          <h3>Operation Timeline</h3>
          <ul className="timeline">
            {operationTimeline.map((e, i) => (
              <li key={i}>
                <div className="time">{e.time}</div>
                <div className="event">{e.event}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Map Overview */}
      <section className="map-overlay">
        <h3>Operation Map Overview</h3>
        <MapContainer
          center={[19.118, 72.905]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "320px", width: "100%", borderRadius: "10px" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapMarkers.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lng]} icon={markerIcon}>
              <Popup>{m.label}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>
    </div>
  );
}
