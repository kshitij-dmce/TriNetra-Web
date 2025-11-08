import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // optional icon (if lucide-react is installed)
import "./hotspotAnalytics.css";

const COLORS = ["#00b26a", "#facc15", "#dc2626", "#60a5fa", "#9333ea"];

const regionData = [
  { region: "Airoli", hazards: 24 },
  { region: "Thane", hazards: 38 },
  { region: "Kalyan", hazards: 45 },
  { region: "Kurla", hazards: 30 },
  { region: "Powai", hazards: 21 },
];

const roadData = [
  { name: "NH48", reports: 34 },
  { name: "Sector 14", reports: 25 },
  { name: "Beach", reports: 42 },
  { name: "Eastern Express", reports: 19 },
];

const repeatHazardData = [
  { name: "Pothole", count: 60 },
  { name: "Accident", count: 40 },
  { name: "Flood", count: 20 },
  { name: "Signal Failure", count: 15 },
];

const predictiveRiskData = [
  { week: "Week 1", risk: 10 },
  { week: "Week 2", risk: 20 },
  { week: "Week 3", risk: 18 },
  { week: "Week 4", risk: 25 },
];

export default function HotspotAnalytics() {
  const [filters, setFilters] = useState({
    type: "all",
    time: "weekly",
  });

  const navigate = useNavigate();
  const handleBack = () => navigate(-1); // goes back to the previous page

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-header-left">
          <button className="back-btn" onClick={handleBack} aria-label="Go back">
            {/* if lucide-react not installed, use ← instead of <ArrowLeft /> */}
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <h2>📊 Hotspot Analytics Dashboard</h2>
        </div>

        <div className="filters">
          <select
            value={filters.type}
            onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
          >
            <option value="all">All Hazard Types</option>
            <option value="Accident">Accident</option>
            <option value="Flood">Flood</option>
            <option value="Pothole">Pothole</option>
          </select>
          <select
            value={filters.time}
            onChange={(e) => setFilters((p) => ({ ...p, time: e.target.value }))}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Hazard Frequency by Region</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hazards" fill="#327263" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Most Reported Roads</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reports" fill="#00b26a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Repeat Hazard Areas</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={repeatHazardData}
                dataKey="count"
                nameKey="name"
                outerRadius={80}
                label
              >
                {repeatHazardData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Predictive Risk Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={predictiveRiskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="legend-section">
        <h4>Heatmap Legend:</h4>
        <div className="legend-items">
          <div><span className="dot safe"></span> Safe Zone</div>
          <div><span className="dot caution"></span> Caution Area</div>
          <div><span className="dot critical"></span> Critical Hotspot</div>
        </div>
      </div>
    </div>
  );
}
