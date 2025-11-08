import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  ShieldCheck,
  FileText,
  Users,
  ChevronLeft,
  Download,
  Share2,
} from "lucide-react";
import "./DriverCompliance.css";

export default function DriverCompliance() {
  const navigate = useNavigate();

  const driverMetrics = [
    { metric: "Safe Events", value: 82 },
    { metric: "Unsafe Events", value: 18 },
    { metric: "Avg Response (sec)", value: 2.6 },
    { metric: "Driver Score", value: 87 },
  ];

  const radarData = [
    { subject: "Alert Response", A: 80, fullMark: 100 },
    { subject: "Speed Control", A: 90, fullMark: 100 },
    { subject: "Fatigue Risk", A: 70, fullMark: 100 },
    { subject: "Braking", A: 85, fullMark: 100 },
    { subject: "Hazard Avoidance", A: 88, fullMark: 100 },
  ];

  const complianceData = [
    {
      driver: "John Carter",
      pii: "Masked",
      dataSync: "OK",
      alertDelivery: "Delivered",
      compliance: "✅ Certified",
    },
    {
      driver: "Priya Sharma",
      pii: "Masked",
      dataSync: "OK",
      alertDelivery: "Delivered",
      compliance: "✅ Certified",
    },
    {
      driver: "Amit Verma",
      pii: "Masked",
      dataSync: "Pending",
      alertDelivery: "Partial",
      compliance: "⚠️ Review",
    },
  ];

  return (
    <div className="dc-page">
      {/* Header */}
      <header className="dc-header">
        <div className="dc-header-container">
          <div className="dc-header-left">
            <button className="dc-back-btn" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
            </button>
            <div className="dc-header-text">
              <h1>Driver Behavior & Compliance</h1>
              <p>Performance and Data Protection Monitoring</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="dc-main">
        <div className="dc-content">
          {/* Metric Cards */}
          <div className="dc-metrics">
            {driverMetrics.map((m, i) => (
              <div className="dc-card" key={i}>
                <h4>{m.metric}</h4>
                <p>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Radar Chart */}
          <div className="dc-chart">
            <div className="dc-chart-card">
              <div className="dc-chart-header">
                <h3>Driver Performance Radar</h3>
                <div className="dc-chart-actions">
                  <button className="dc-action-btn">
                    <Download size={14} /> Export
                  </button>
                  <button className="dc-action-btn">
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Tooltip />
                  <Radar
                    name="Driver"
                    dataKey="A"
                    stroke="#036b51"
                    fill="#036b51"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Table */}
          <div className="dc-table">
            <div className="dc-table-header">
              <Users size={18} />
              <h3>Driver Data Compliance Table</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>PII Status</th>
                  <th>Data Sync</th>
                  <th>Alert Delivery</th>
                  <th>Compliance</th>
                </tr>
              </thead>
              <tbody>
                {complianceData.map((d, i) => (
                  <tr key={i}>
                    <td>{d.driver}</td>
                    <td>{d.pii}</td>
                    <td>{d.dataSync}</td>
                    <td>{d.alertDelivery}</td>
                    <td
                      className={
                        d.compliance.includes("⚠️") ? "dc-review" : "dc-certified"
                      }
                    >
                      {d.compliance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Privacy Badge */}
          <div className="dc-privacy">
            <ShieldCheck size={20} />
            <p>Data Privacy Certified ✅</p>
          </div>

          {/* Export Button */}
          <div className="dc-export">
            <button onClick={() => alert("Exporting compliance report...")}>
              <FileText size={16} /> Export Compliance Report (PDF)
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dc-footer">
        <div className="dc-footer-container">
          <span>© 2025 TriNetra | Volkswagen Driver Analytics</span>
          <div className="dc-footer-links">
            <a href="/help">Help Center</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
