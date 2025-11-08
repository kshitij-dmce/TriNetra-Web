import React, { useState, useEffect } from "react";
import "./FleetAnalytics.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Activity, FileText } from "lucide-react";

export default function FleetAnalytics() {
  // Real-time ticker data
  const [alerts, setAlerts] = useState([
    "🚨 Virtus reported debris on Sector 9 road",
    "⚠️ Taigun detected sudden brake anomaly",
    "🛠️ Tiguan engine health check scheduled",
  ]);

  // Simulate live alerts (every 8 sec)
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = `⚡ New alert at ${new Date().toLocaleTimeString()} — Fleet status updated`;
      setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Dummy data
  const safetyTrendData = [
    { month: "Jan", score: 85 },
    { month: "Feb", score: 88 },
    { month: "Mar", score: 83 },
    { month: "Apr", score: 90 },
    { month: "May", score: 87 },
  ];

  const hazardAreaData = [
    { area: "Sector 9", hazards: 22 },
    { area: "Airoli Bridge", hazards: 18 },
    { area: "Palm Beach Rd", hazards: 25 },
    { area: "NH48", hazards: 16 },
  ];

  const riskyRoutes = [
    { route: "Airoli → Thane", risk: "High" },
    { route: "NH48 → Navi Mumbai", risk: "Moderate" },
    { route: "Palm Beach → Sector 12", risk: "Low" },
  ];

  return (
    <div className="fleet-analytics-page">
      <div className="fleet-analytics-header">
        <h2>📈 Fleet Analytics</h2>
        <p>Real-time insights into fleet safety, risk trends, and operational alerts.</p>
      </div>

      {/* ===== Hazard Ticker ===== */}
      <div className="hazard-ticker">
        <div className="ticker-title">
          <Activity size={18} /> Live Fleet Alerts
        </div>
        <div className="ticker-body">
          <marquee>
            {alerts.map((a, i) => (
              <span key={i}>{a} &nbsp;&nbsp;&nbsp;</span>
            ))}
          </marquee>
        </div>
      </div>

      {/* ===== Charts Section ===== */}
      <div className="charts-grid">
        {/* Fleet Safety Over Time */}
        <div className="chart-card">
          <h3>Fleet Safety Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={safetyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[70, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#327263"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Frequent Hazard Areas */}
        <div className="chart-card">
          <h3>Frequent Hazard Areas</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hazardAreaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hazards" fill="#00b26a" radius={[6, 6, 0, 0]}>
                {hazardAreaData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#327263", "#60a5fa", "#facc15", "#dc2626"][index]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== Risky Routes Section ===== */}
      <div className="risky-routes">
        <h3>🚧 Risky Routes Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {riskyRoutes.map((r, i) => (
              <tr key={i}>
                <td>{r.route}</td>
                <td className={`risk ${r.risk.toLowerCase()}`}>{r.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Insights Button ===== */}
      <div className="insights-btn-container">
        <button onClick={() => alert("Generating insights report...")}>
          <FileText size={16} /> Generate Insights
        </button>
      </div>
    </div>
  );
}
