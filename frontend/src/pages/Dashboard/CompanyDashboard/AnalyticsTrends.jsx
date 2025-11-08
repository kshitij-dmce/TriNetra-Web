import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, Clock, Filter,
  Download, Share2, BarChart2, PieChart as PieIcon,
  Map, TrendingUp 
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import Papa from "papaparse";
import "./AnalyticsTrends.css";

// 🔥 Heatmap Layer Component
function HeatmapLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const heatPoints = points.map((p) => [p.lat, p.lon, p.intensity]);
    const heatLayer = L.heatLayer(heatPoints, {
      radius: 20,
      blur: 18,
      maxZoom: 8,
      minOpacity: 0.5,
    }).addTo(map);
    return () => {
      heatLayer.remove();
    };
  }, [points, map]);
  return null;
}

export default function AnalyticsTrends() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    region: "All",
    vehicle: "All",
    severity: "All",
    time: "Weekly",
  });

  const [heatPoints, setHeatPoints] = useState([]);

  useEffect(() => {
    Papa.parse("/road_issue_dataset_4000.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data
          .map((row) => {
            const lat = parseFloat(row.Latitude);
            const lon = parseFloat(row.Longitude);
            const count = parseInt(row.Count) || 1;
            if (isNaN(lat) || isNaN(lon)) return null;
            return { lat, lon, intensity: count / 5 };
          })
          .filter(Boolean);
        setHeatPoints(parsed);
      },
    });
  }, []);

  // Dummy Data
  const trendData = [
    { date: "Week 1", hazards: 24 },
    { date: "Week 2", hazards: 36 },
    { date: "Week 3", hazards: 28 },
    { date: "Week 4", hazards: 45 },
  ];

  const hotspotData = [
    { area: "Sector 9", reports: 12 },
    { area: "Borivali", reports: 8 },
    { area: "Palm Beach Rd", reports: 14 },
    { area: "NH48", reports: 10 },
  ];

  const severityData = [
    { name: "Low", value: 25 },
    { name: "Medium", value: 40 },
    { name: "High", value: 20 },
    { name: "Critical", value: 15 },
  ];

  const COLORS = ["#16a34a", "#facc15", "#f97316", "#dc2626"];

  return (
    <div className="at-page">
      {/* Header */}
      <header className="at-header">
        <div className="at-header-container">
          <div className="at-header-left">
            <button className="at-back-btn" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
            </button>
            <div className="at-header-text">
              <h1>Analytics & Trends</h1>
              <p>Data Visualization and Hotspot Monitoring</p>
            </div>
          </div>
        </div>
      </header>

      <main className="at-main">
        <div className="at-content">
          {/* Filters */}
          <div className="at-filters">
            <div className="at-filters-header">
              <div className="at-filters-title">
                <Filter size={16} />
                <h3>Filter Analytics</h3>
              </div>
              <div className="at-filters-actions">
                <button className="at-action-btn">
                  <Download size={16} /> Export
                </button>
                <button className="at-action-btn">
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
            <div className="at-filters-body">
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              >
                <option>All Regions</option>
                <option>Airoli</option>
                <option>Thane</option>
                <option>Navi Mumbai</option>
              </select>

              <select
                value={filters.vehicle}
                onChange={(e) => setFilters({ ...filters, vehicle: e.target.value })}
              >
                <option>All Vehicles</option>
                <option>Virtus</option>
                <option>Taigun</option>
                <option>Tiguan</option>
              </select>

              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              >
                <option>All Severity</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>

              <select
                value={filters.time}
                onChange={(e) => setFilters({ ...filters, time: e.target.value })}
              >
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
          </div>

          {/* Charts */}
          <div className="at-grid">
            <div className="at-card">
              <div className="at-card-header">
                <TrendingUp size={20} />
                <h3>Hazard Frequency Over Time</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hazards" stroke="#036b51" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="at-card">
              <div className="at-card-header">
                <BarChart2 size={20} />
                <h3>Hotspot Detection</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={hotspotData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reports" fill="#036b51" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="at-card">
              <div className="at-card-header">
                <PieIcon size={20} />
                <h3>Hazard Severity Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="at-card">
              <div className="at-card-header">
                <Map size={20} />
                <h3>City-Wide Heatmap</h3>
              </div>
              <div className="at-map">
                <MapContainer center={[22.9734, 78.6569]} zoom={5} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <HeatmapLayer points={heatPoints} />
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="at-footer">
        <div className="at-footer-container">
          <span>© 2025 TriNetra | Volkswagen Analytics Platform</span>
          <div className="at-footer-links">
            <a href="/help">Help Center</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
