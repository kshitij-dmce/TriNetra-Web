import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  AlertTriangle,
  Clock,
  X,
  ChevronLeft,
  Check,
  Filter,
} from "lucide-react";
import "./ViewHazards.css";

// 🗺️ Reverse Geocoding (Non-blocking)
const getAddressFromLatLng = async (lat, lng) => {
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await resp.json();
    return (
      data.display_name ||
      `${lat.toFixed(5)}, ${lng.toFixed(5)} (Unknown address)`
    );
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)} (Unknown address)`;
  }
};

// 🕒 Timestamp Formatter
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  try {
    let dateObj;
    if (typeof timestamp.toDate === "function") {
      dateObj = timestamp.toDate();
    } else {
      dateObj = new Date(timestamp);
    }
    return dateObj.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return String(timestamp);
  }
};

// 💀 Skeleton Loader
const SkeletonRow = () => (
  <tr className="vh-skeleton-row">
    <td colSpan="6">
      <div className="vh-skeleton shimmer"></div>
    </td>
  </tr>
);

export default function ViewHazards() {
  const navigate = useNavigate();
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);

  const vehicleOptions = ["Virtus", "Taigun", "Tiguan", "Golf GTI", "Virtus Chrome"];
  const [filters, setFilters] = useState({ vehicle: "all", type: "all", date: "" });

  useEffect(() => {
    const fetchHazards = async () => {
      setLoading(true);
      let hazardList = [];

      try {
        const { initializeApp } = await import("firebase/app");
        const { getFirestore, collection, getDocs, orderBy, query, limit } =
          await import("firebase/firestore");

        const firebaseConfig = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const q = query(
          collection(db, "live_alerts"),
          orderBy("timestamp", "desc"),
          limit(100)
        );
        const querySnapshot = await getDocs(q);

        hazardList = querySnapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            vehicle: vehicleOptions[Math.floor(Math.random() * vehicleOptions.length)],
            lat: d.lat,
            lng: d.long,
            type: d.alert_type || "Unknown",
            time: formatTimestamp(d.timestamp),
            severity: d.severity || "Medium",
            status: d.status || "Pending",
            confidence: d.confidence || Math.floor(Math.random() * 11) + 89,
            location: "",
            image: "https://source.unsplash.com/400x200/?road,traffic",
          };
        });

        setHazards(hazardList);

        hazardList.forEach(async (h, index) => {
          const addr = await getAddressFromLatLng(h.lat, h.lng);
          setHazards((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], location: addr };
            return updated;
          });
        });
      } catch (err) {
        console.error("❌ Firestore Fetch Error:", err);
      }

      setTimeout(() => setLoading(false), 1500);
    };

    fetchHazards();
  }, []);

  const filtered = hazards.filter((h) => {
    const vMatch = filters.vehicle === "all" || h.vehicle === filters.vehicle;
    const tMatch = filters.type === "all" || h.type === filters.type;
    const dMatch = !filters.date || h.time?.includes(filters.date);
    return vMatch && tMatch && dMatch;
  });

  return (
    <div className="vh-page">
      {/* Header */}
      <header className="vh-header">
        <div className="vh-header-container">
          <div className="vh-header-left">
            <button className="vh-back-btn" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
            </button>
            <div className="vh-header-text">
              <h1>View Hazards</h1>
              <p>Live Incident Monitoring Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="vh-main">
        <div className="vh-content">
          {/* Stats */}
          <div className="vh-stats">
            <div className="vh-card">
              <AlertTriangle size={20} />
              <div className="vh-info">
                <h4>Total Hazards</h4>
                <p>{hazards.length}</p>
              </div>
            </div>
            <div className="vh-card warning">
              <Clock size={20} />
              <div className="vh-info">
                <h4>Pending Review</h4>
                <p>{hazards.filter((h) => h.status === "Pending").length}</p>
              </div>
            </div>
            <div className="vh-card success">
              <Check size={20} />
              <div className="vh-info">
                <h4>Resolved</h4>
                <p>{hazards.filter((h) => h.status === "Resolved").length}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="vh-filters">
            <div className="vh-filters-header">
              <div className="vh-filters-title">
                <Filter size={16} />
                <h3>Filter Hazards</h3>
              </div>
              <button
                className="vh-clear-btn"
                onClick={() => setFilters({ vehicle: "all", type: "all", date: "" })}
              >
                Clear Filters
              </button>
            </div>

            <div className="vh-filters-body">
              <select
                value={filters.vehicle}
                onChange={(e) => setFilters({ ...filters, vehicle: e.target.value })}
              >
                <option value="all">All Vehicles</option>
                {vehicleOptions.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">All Hazard Types</option>
                <option value="Pothole">Pothole</option>
                <option value="Debris">Debris</option>
                <option value="Water Logged">Water Logged</option>
                <option value="Unknown">Unknown</option>
              </select>

              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="vh-table">
            {loading ? (
              <table>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Date & Time</th>
                    <th>Severity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((h) => (
                    <tr key={h.id} onClick={() => setSelectedHazard(h)}>
                      <td>{h.vehicle}</td>
                      <td className="vh-location">
  <MapPin size={14} />
  {h.location ||
    (typeof h.lat === "number" && typeof h.lng === "number"
      ? `${h.lat.toFixed(4)}, ${h.lng.toFixed(4)}`
      : "Unknown")}
</td>
                      <td>{h.type}</td>
                      <td>{h.time}</td>
                      <td>
                        <span className={`vh-severity ${h.severity.toLowerCase()}`}>
                          {h.severity}
                        </span>
                      </td>
                      <td>
                        <span className={`vh-status ${h.status.toLowerCase()}`}>
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && filtered.length === 0 && (
              <div className="vh-no-results">No hazards found for filters.</div>
            )}
          </div>
        </div>
      </main>

      {/* Hazard Detail Panel */}
      {selectedHazard && (
        <div className="vh-panel-overlay" onClick={() => setSelectedHazard(null)}>
          <div className="vh-panel" onClick={(e) => e.stopPropagation()}>
            <div className="vh-panel-header">
              <h3>{selectedHazard.type}</h3>
              <button className="vh-close-btn" onClick={() => setSelectedHazard(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="vh-panel-body">
              <img src={selectedHazard.image} alt="hazard" className="vh-img" />
              <span className={`vh-badge ${selectedHazard.severity.toLowerCase()}`}>
                {selectedHazard.severity} Severity
              </span>
              <div className="vh-detail">
                <p><MapPin size={14}/> {selectedHazard.location}</p>
                <p><Clock size={14}/> {selectedHazard.time}</p>
                <p><AlertTriangle size={14}/> Confidence: {selectedHazard.confidence}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
