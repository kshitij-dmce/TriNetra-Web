import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, Clock, User, Filter,
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

// Custom hook to render heatmap layer
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

  // Load city data for heatmap
  useEffect(() => {
    Papa.parse("/road_issue_dataset_4000.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data
          .map((row, index) => {
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

  // Dummy chart data
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
    <div className="analytics-page">
      {/* Header */}
      <header className="analytics-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
            </button>
            <div className="header-info">
              <h1 className="header-title">Analytics & Trends</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="analytics-main">
        <div className="content-container">
          {/* Filters */}
          <div className="filters-section">
            <div className="filters-header">
              <div className="filters-title">
                <Filter size={16} />
                <h3>Filter Analytics</h3>
              </div>
              <div className="filters-actions">
                <button className="action-btn">
                  <Download size={16} />
                  Export
                </button>
                <button className="action-btn">
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
            <div className="analytics-filters">
              <select
                value={filters.region}
                onChange={(e) =>
                  setFilters({ ...filters, region: e.target.value })
                }
              >
                <option>All Regions</option>
                <option>Airoli</option>
                <option>Thane</option>
                <option>Navi Mumbai</option>
              </select>

              <select
                value={filters.vehicle}
                onChange={(e) =>
                  setFilters({ ...filters, vehicle: e.target.value })
                }
              >
                <option>All Vehicles</option>
                <option>Virtus</option>
                <option>Taigun</option>
                <option>Tiguan</option>
              </select>

              <select
                value={filters.severity}
                onChange={(e) =>
                  setFilters({ ...filters, severity: e.target.value })
                }
              >
                <option>All Severity</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>

              <select
                value={filters.time}
                onChange={(e) =>
                  setFilters({ ...filters, time: e.target.value })
                }
              >
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Hazard Frequency Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <TrendingUp size={20} />
                <h3>Hazard Frequency Over Time</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="hazards"
                    stroke="#036b51"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Hotspot Detection Chart */}
            <div className="chart-card">
              <div className="chart-header">
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

            {/* Severity Distribution Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <PieIcon size={20} />
                <h3>Hazard Severity Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {severityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* City-Wide Heatmap */}
            <div className="chart-card">
              <div className="chart-header">
                <Map size={20} />
                <h3>City-Wide Heatmap</h3>
              </div>
              <div style={{ height: "300px", width: "100%", borderRadius: "8px", overflow: "hidden" }}>
                <MapContainer
                  center={[22.9734, 78.6569]} // Center of India
                  zoom={5}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <HeatmapLayer points={heatPoints} />
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="analytics-footer">
        <div className="footer-content">
          <span>© 2025 TriNetra | Volkswagen Analytics Platform</span>
          <div className="footer-links">
            <a href="/help">Help Center</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
