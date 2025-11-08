import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import { ChevronLeft, RefreshCcw, AlertTriangle, MapPin } from "lucide-react";
import Papa from "papaparse";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./liveMap.css";

const { BaseLayer } = LayersControl;

// Remove default Leaflet icon path errors
delete L.Icon.Default.prototype._getIconUrl;

// Custom circular color marker
const createMarkerIcon = (color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 8px rgba(0,0,0,0.3);
        transition: transform 0.2s ease-in-out;
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Severity mapping colors
const SEVERITY_COLORS = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
};

export default function LiveMap() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Load CSV file dynamically
  useEffect(() => {
    Papa.parse("/road_issue_dataset_4000.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data
          .map((row, index) => {
            const lat = parseFloat(row.Latitude?.trim());
            const lon = parseFloat(row.Longitude?.trim());
            if (isNaN(lat) || isNaN(lon)) {
              console.warn(`⚠️ Skipping invalid row #${index}:`, row);
              return null;
            }

            const count = parseInt(row.Count) || 0;
            let severity = "low";
            if (count >= 5) severity = "high";
            else if (count >= 3) severity = "medium";

            return {
              id: index,
              city: row.City?.trim() || "Unknown",
              state: row.State?.trim() || "Unknown",
              direction: row.Direction?.trim() || "N/A",
              position: [lat, lon],
              title: row.Problem?.trim() || "Unspecified Issue",
              count,
              severity,
            };
          })
          .filter(Boolean);

        setIncidents(parsedData);
      },
    });
  }, []);

  // Refresh button
  const refreshMap = () => setLastUpdated(new Date());

  const filteredIncidents = incidents.filter(
    (incident) =>
      selectedSeverity === "all" || incident.severity === selectedSeverity
  );

  return (
    <div className="livemap">
      {/* Header */}
      <header className="livemap-header">
        <div className="header-left">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="header-title">
            <h1>India Road Issue Map</h1>
            <p>Real-Time Visualization by State & Direction</p>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="livemap-controls">
        <div className="control-group">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="severity-select"
          >
            <option value="all">All Severities</option>
            <option value="low">Low Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="high">High Severity</option>
          </select>
          <button className="refresh-btn" onClick={refreshMap}>
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>

        <div className="incident-counter">
          <AlertTriangle size={16} />
          <span>{filteredIncidents.length} Active Issues</span>
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
        <MapContainer
          center={[22.9734, 78.6569]} // Centered on India
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <LayersControl position="topright">
            <BaseLayer checked name="Street View">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
            </BaseLayer>
            <BaseLayer name="Satellite View">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="&copy; Esri & contributors"
              />
            </BaseLayer>
          </LayersControl>

          {filteredIncidents.map((incident) => (
            <Marker
              key={incident.id}
              position={incident.position}
              icon={createMarkerIcon(SEVERITY_COLORS[incident.severity])}
            >
              <Popup>
                <div className="incident-popup">
                  <h3>{incident.title}</h3>
                  <div className="popup-details">
                    <span className={`severity-badge ${incident.severity}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                    <p><MapPin size={12} /> {incident.city}, {incident.state}</p>
                    <p>🧭 Region: {incident.direction}</p>
                    <p>Count: {incident.count}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="map-legend">
          <h4>Legend</h4>
          <ul>
            <li><span className="legend-dot low"></span>Low (Count ≤ 2)</li>
            <li><span className="legend-dot medium"></span>Medium (3–4)</li>
            <li><span className="legend-dot high"></span>High (5)</li>
          </ul>
          <p className="legend-updated">
            Last Updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
