import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import { ChevronLeft, RefreshCcw, AlertTriangle, MapPin } from "lucide-react";
import Papa from "papaparse";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LiveMap.css";

const { BaseLayer } = LayersControl;

// Remove default Leaflet icon path errors
delete L.Icon.Default.prototype._getIconUrl;

// Custom circular color marker
const createMarkerIcon = (color) => {
  return L.divIcon({
    html: `<div style="background-color:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const SEVERITY_COLORS = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
};

export default function LiveMapEnhanced() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(new Date());

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
            if (isNaN(lat) || isNaN(lon)) return null;

            const count = parseInt(row.Count) || 0;
            let severity = count >= 5 ? "high" : count >= 3 ? "medium" : "low";

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

  const refreshMap = () => setLastUpdated(new Date());

  const filteredIncidents = incidents.filter(
    (incident) =>
      selectedSeverity === "all" || incident.severity === selectedSeverity
  );

  return (
    <div className="trinetra-map-wrapper">
      {/* Header */}
      <header className="trinetra-map-header">
        <div className="trinetra-map-header-left">
          <button
            className="trinetra-map-back"
            onClick={() => navigate(-1)}
            aria-label="Go Back"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="trinetra-map-header-title">
            <h1>TriNetra Live Hazard Map</h1>
            <p>Real-Time Insights & Data-Driven Analytics</p>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="trinetra-map-controls">
        <div className="trinetra-map-controls-left">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="trinetra-map-select"
          >
            <option value="all">All</option>
            <option value="low">Low Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="high">High Severity</option>
          </select>
          <button className="trinetra-map-refresh" onClick={refreshMap}>
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>
        <div className="trinetra-map-issuecount">
          <AlertTriangle size={16} />
          <span>{filteredIncidents.length} Active Reports</span>
        </div>
      </div>

      {/* Map */}
      <div className="trinetra-map-container">
        <MapContainer center={[22.9734, 78.6569]} zoom={6} style={{ height: "100%", width: "100%" }}>
          <LayersControl position="topright">
            <BaseLayer checked name="Street View">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
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
                <div className="trinetra-map-popup">
                  <h3>{incident.title}</h3>
                  <p><MapPin size={12} /> {incident.city}, {incident.state}</p>
                  <p>🧭 {incident.direction}</p>
                  <p>Count: {incident.count}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="trinetra-map-legend">
          <h4>Legend</h4>
          <ul>
            <li><span className="trinetra-dot low"></span> Low (≤ 2)</li>
            <li><span className="trinetra-dot medium"></span> Medium (3–4)</li>
            <li><span className="trinetra-dot high"></span> High (≥ 5)</li>
          </ul>
          <p className="trinetra-legend-updated">
            Last Updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
