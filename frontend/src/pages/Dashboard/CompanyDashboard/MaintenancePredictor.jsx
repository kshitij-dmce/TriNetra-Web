import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { 
  Wrench, AlertTriangle, FileText, ChevronLeft,
  Download, Share2 
} from "lucide-react";
import "./MaintenancePredictor.css";

export default function MaintenancePredictor() {
  const navigate = useNavigate();

  const maintenanceStats = [
    { id: 1, title: "Upcoming Service Due", value: 12, color: "#facc15" },
    { id: 2, title: "High-Wear Vehicles", value: 7, color: "#dc2626" },
    { id: 3, title: "Performance Anomalies", value: 5, color: "#327263" },
  ];

  const trendData = [
    { month: "Jan", avgServiceTime: 22, hazardExposure: 15 },
    { month: "Feb", avgServiceTime: 25, hazardExposure: 18 },
    { month: "Mar", avgServiceTime: 19, hazardExposure: 20 },
    { month: "Apr", avgServiceTime: 21, hazardExposure: 24 },
    { month: "May", avgServiceTime: 23, hazardExposure: 22 },
  ];

  return (
    <div className="maintenance-page">
      {/* Header */}
      <header className="maintenance-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
            </button>
            <div className="header-info">
              <h1 className="header-title">Maintenance Predictor</h1>
            
            </div>
          </div>
        </div>
      </header>

      <main className="maintenance-main">
        <div className="content-container">
          {/* Summary Cards */}
          <div className="maintenance-summary">
            {maintenanceStats.map((m) => (
              <div
                key={m.id}
                className="maintenance-card"
                style={{ borderTop: `4px solid ${m.color}` }}
              >
                <h3>{m.title}</h3>
                <p>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="chart-section">
            <div className="chart-card">
              <h3>Avg Time Between Services vs Hazard Exposure</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avgServiceTime"
                    stroke="#036b51"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Avg Service Interval (Days)"
                  />
                  <Line
                    type="monotone"
                    dataKey="hazardExposure"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Hazard Exposure Index"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Maintenance Table */}
          <div className="maintenance-table">
            <h3>Vehicle Maintenance Forecast</h3>
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Last Service</th>
                  <th>Next Service (Est.)</th>
                  <th>Wear Risk</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Volkswagen Virtus</td>
                  <td>Feb 12, 2025</td>
                  <td>Apr 20, 2025</td>
                  <td className="risk high">High</td>
                  <td>
                    <button className="action-btn">
                      <AlertTriangle size={14} /> Schedule
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Volkswagen Taigun</td>
                  <td>Mar 5, 2025</td>
                  <td>May 22, 2025</td>
                  <td className="risk medium">Medium</td>
                  <td>
                    <button className="action-btn">
                      <Wrench size={14} /> Review
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Volkswagen Tiguan</td>
                  <td>Jan 28, 2025</td>
                  <td>Apr 2, 2025</td>
                  <td className="risk critical">Critical</td>
                  <td>
                    <button className="action-btn">
                      <FileText size={14} /> Report
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Generate Report */}
          <div className="report-btn-container">
            <button onClick={() => alert("Generating Maintenance Report...")}>
              <FileText size={16} /> Generate Maintenance Report (PDF)
            </button>
          </div>
        </div>
      </main>

      <footer className="maintenance-footer">
        <div className="footer-content">
          <span>© 2025 TriNetra | Volkswagen Maintenance Analytics</span>
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