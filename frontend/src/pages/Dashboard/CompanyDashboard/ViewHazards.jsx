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

// 🗺️ Address API (non-blocking)
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

// 🕒 Timestamp Formatter (Firestore or string)
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  try {
    let dateObj;
    if (typeof timestamp.toDate === "function") {
      dateObj = timestamp.toDate();
    } else if (typeof timestamp === "string" || typeof timestamp === "number") {
      dateObj = new Date(timestamp);
    } else {
      return "";
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

// 💀 Skeleton Row Component
const SkeletonRow = () => (
  <tr className="skeleton-row">
    <td colSpan="6">
      <div className="skeleton shimmer"></div>
    </td>
  </tr>
);

export default function ViewHazards() {
  const navigate = useNavigate();
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚘 Vehicle List
  const vehicleOptions = ["Virtus", "Taigun", "Tiguan", "Golf GTI", "Virtus Chrome"];

  // 🔍 Filters
  const [filters, setFilters] = useState({
    vehicle: "all",
    type: "all",
    date: "",
  });

  // 🧩 Fetch hazards (fast + async address)
  useEffect(() => {
    const fetchHazards = async () => {
      setLoading(true);
      let hazardList = [];

      try {
        const { initializeApp } = await import("firebase/app");
        const {
          getFirestore,
          collection,
          getDocs,
          orderBy,
          query,
          limit,
        } = await import("firebase/firestore");

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

        const q = query(collection(db, "live_alerts"), orderBy("timestamp", "desc"), limit(100));
        const querySnapshot = await getDocs(q);

        // Create hazard list (no address yet)
        hazardList = querySnapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            vehicle:
              vehicleOptions[Math.floor(Math.random() * vehicleOptions.length)],
            lat: d.lat,
            lng: d.long,
            type: d.alert_type || "Unknown",
            time: formatTimestamp(d.timestamp),
            severity: d.severity || "Medium",
            status: d.status || "Pending",
            confidence: d.confidence || Math.floor(Math.random() * 11) + 89,
            location: "", // to be filled later
            image: "https://source.unsplash.com/400x200/?road,traffic",
          };
        });

        // Set immediately — show list without waiting for addresses
        setHazards(hazardList);

        // 🚀 Asynchronously fill addresses
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

      // Show skeleton for 1.5s max
      setTimeout(() => setLoading(false), 1500);
    };

    fetchHazards();
  }, []);

  // ⚙️ Filter logic (case-insensitive)
  const filtered = hazards.filter((h) => {
    const vehicleMatch =
      filters.vehicle === "all" ||
      h.vehicle.toLowerCase() === filters.vehicle.toLowerCase();

    const typeMatch =
      filters.type === "all" ||
      h.type.toLowerCase() === filters.type.toLowerCase();

    const dateMatch =
      !filters.date ||
      (h.time && h.time.toLowerCase().includes(filters.date.toLowerCase()));

    return vehicleMatch && typeMatch && dateMatch;
  });

  return (
    <div className="hazards-page">
      {/* Header */}
      <header className="hazards-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
            </button>
            <div className="header-title">View Hazards</div>
          </div>
        </div>
      </header>

      <main className="hazards-main">
        <div className="content-container">
          {/* Stats Summary */}
          <div className="stats-summary">
            <div className="stat-card">
              <AlertTriangle size={20} />
              <div className="stat-info">
                <h4>Total Hazards</h4>
                <p>{hazards.length}</p>
              </div>
            </div>
            <div className="stat-card warning">
              <Clock size={20} />
              <div className="stat-info">
                <h4>Pending Review</h4>
                <p>{hazards.filter((h) => h.status === "Pending").length}</p>
              </div>
            </div>
            <div className="stat-card success">
              <Check size={20} />
              <div className="stat-info">
                <h4>Resolved</h4>
                <p>{hazards.filter((h) => h.status === "Resolved").length}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filters-header">
              <div className="filters-title">
                <Filter size={16} />
                <h3>Filter Hazards</h3>
              </div>
              <button
                className="clear-filters"
                onClick={() =>
                  setFilters({ vehicle: "all", type: "all", date: "" })
                }
              >
                Clear Filters
              </button>
            </div>
            <div className="hazard-filters">
              <select
                value={filters.vehicle}
                onChange={(e) =>
                  setFilters({ ...filters, vehicle: e.target.value })
                }
              >
                <option value="all">All Vehicles</option>
                {vehicleOptions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
              >
                <option value="all">All Hazard Types</option>
                <option value="Pothole">Pothole</option>
                <option value="Debris">Debris</option>
                <option value="Stalled Vehicle">Stalled Vehicle</option>
                <option value="Water Logged">Water Logged</option>
                <option value="Unknown">Unknown</option>
              </select>

              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="hazard-table-wrap">
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
                      <td>
                        <div className="location-cell">
                          <MapPin size={14} />
                          {h.location || `${h.lat.toFixed(4)}, ${h.lng.toFixed(4)}`}
                        </div>
                      </td>
                      <td>{h.type}</td>
                      <td>{h.time}</td>
                      <td>
                        <span className={`severity ${h.severity.toLowerCase()}`}>
                          {h.severity}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${h.status.toLowerCase()}`}>
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && filtered.length === 0 && (
              <div className="no-results">
                No hazards found for your filters.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Hazard Details Panel */}
      {selectedHazard && (
        <div
          className="hazard-panel-overlay"
          onClick={() => setSelectedHazard(null)}
        >
          <div className="hazard-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header">
              <h3>{selectedHazard.type} Detected</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedHazard(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="panel-body">
              <div className="hazard-image">
                <img src={selectedHazard.image} alt="hazard" />
                <span
                  className={`severity-badge ${selectedHazard.severity.toLowerCase()}`}
                >
                  {selectedHazard.severity} Severity
                </span>
              </div>
              <div className="hazard-details">
                <div className="detail-item">
                  <MapPin size={16} />
                  <div>
                    <strong>Location</strong>
                    <span>
                      {selectedHazard.location ||
                        `${selectedHazard.lat.toFixed(4)}, ${selectedHazard.lng.toFixed(4)}`}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  <div>
                    <strong>Detected At</strong>
                    <span>{selectedHazard.time}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <AlertTriangle size={16} />
                  <div>
                    <strong>Confidence Score</strong>
                    <span>{selectedHazard.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
