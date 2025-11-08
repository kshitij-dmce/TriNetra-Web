import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import {
  Activity, Wrench, Car, ChevronLeft, Clock,
  User, TrendingUp, AlertTriangle
} from "lucide-react";
import "./fleetGovernmentAnalytics.css";

const RISK_COLORS = ["#16a34a", "#facc15", "#dc2626", "#327263"];

// Sample data
const riskTrendData = [
  { week: "Week 1", risk: 35 },
  { week: "Week 2", risk: 42 },
  { week: "Week 3", risk: 38 },
  { week: "Week 4", risk: 50 },
];

const hazardDistData = [
  { distance: "0–100 km", hazards: 2 },
  { distance: "100–200 km", hazards: 5 },
  { distance: "200–300 km", hazards: 3 },
  { distance: "300–400 km", hazards: 6 },
  { distance: "400–500 km", hazards: 4 },
];

const maintenanceData = [
  { type: "Engine Check", probability: 70 },
  { type: "Brake Wear", probability: 50 },
  { type: "Tire Replacement", probability: 30 },
  { type: "Emission Alert", probability: 20 },
];

export default function Analytics() {
  const navigate = useNavigate();
  
 

  const formatUTCDateTime = (date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  return (
    <div className="ana-page">
      <header className="ana-header">
        <div className="ana-header-container">
          <div className="ana-header-left">
            <button
              className="ana-back-btn"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="ana-title">
              <h1>Vehicle Analytics</h1>
              <span className="ana-subtitle">Real-time fleet monitoring system</span>
            </div>
          </div>

          
        </div>
      </header>

      <main className="ana-main">
        {/* Summary Cards */}
        <div className="ana-metrics">
          <div className="ana-metric-card">
            <div className="ana-card-icon primary">
              <Car size={20} />
            </div>
            <div className="ana-card-content">
              <h3>Active Vehicles</h3>
              <div className="ana-value">128</div>
              <div className="ana-trend positive">
                <TrendingUp size={14} />
                <span>+12% vs last week</span>
              </div>
            </div>
          </div>

          <div className="ana-metric-card">
            <div className="ana-card-icon warning">
              <AlertTriangle size={20} />
            </div>
            <div className="ana-card-content">
              <h3>Active Alerts</h3>
              <div className="ana-value">18</div>
              <div className="ana-trend negative">
                <TrendingUp size={14} />
                <span>+3 new alerts</span>
              </div>
            </div>
          </div>

          <div className="ana-metric-card">
            <div className="ana-card-icon success">
              <Activity size={20} />
            </div>
            <div className="ana-card-content">
              <h3>System Health</h3>
              <div className="ana-value">92%</div>
              <div className="ana-trend positive">
                <TrendingUp size={14} />
                <span>+5% improvement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="ana-charts">
          <div className="ana-chart-card">
            <div className="ana-chart-header">
              <h3>Risk Score Trends</h3>
              <select className="ana-time-select">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#059669" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="ana-chart-card">
            <div className="ana-chart-header">
              <h3>Hazard Distribution</h3>
              <div className="ana-legend">
                <span className="ana-legend-dot"></span>
                <span>Per 100km Range</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hazardDistData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="distance" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar
                  dataKey="hazards"
                  fill="#059669"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Section */}
        <section className="ana-maintenance">
          <div className="ana-section-header">
            <h2>
              <Wrench size={18} />
              Predictive Maintenance
            </h2>
          </div>
          <div className="ana-maint-grid">
            {maintenanceData.map((item, index) => (
              <div key={index} className="ana-maint-card">
                <h4>{item.type}</h4>
                <div className="ana-progress">
                  <div
                    className="ana-progress-fill"
                    style={{ width: `${item.probability}%` }}
                  >
                    <span className="ana-progress-label">
                      {item.probability}%
                    </span>
                  </div>
                </div>
                <p className="ana-maint-text">
                  Required within 30 days
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Risk Distribution */}
        <div className="ana-chart-card">
          <div className="ana-chart-header">
            <h3>Risk Analysis</h3>
            <div className="ana-risk-legend">
              {["Low", "Medium", "High"].map((risk, i) => (
                <div key={i} className="ana-legend-item">
                  <span
                    className="ana-color-dot"
                    style={{ background: RISK_COLORS[i] }}
                  />
                  <span>{risk} Risk</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Low Risk", value: 45 },
                  { name: "Medium Risk", value: 35 },
                  { name: "High Risk", value: 20 },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {RISK_COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}