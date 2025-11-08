import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { 
  ShieldCheck, FileText, Users, ChevronLeft,
  Download, Share2 
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
    <div className="compliance-page">
      {/* Header */}
      <header className="compliance-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
                         <ChevronLeft size={20} />
                       </button>
            <h1 className="header-title">Driver Behavior & Compliance</h1>
          </div>
          
        </div>
      </header>

      <main className="compliance-main">
        <div className="content-container">
          {/* Metrics Cards */}
          <div className="driver-metrics">
            {driverMetrics.map((m, i) => (
              <div className="metric-card" key={i}>
                <h4>{m.metric}</h4>
                <p>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Radar Chart Section */}
          <div className="chart-section">
            <div className="chart-card">
              <h3>Driver Performance Radar</h3>
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
          <div className="compliance-section">
            <div className="table-header">
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
                    <td className={d.compliance.includes("⚠️") ? "review" : "certified"}>
                      {d.compliance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Privacy Badge */}
          <div className="privacy-badge">
            <ShieldCheck size={20} />
            <p>Data Privacy Certified ✅</p>
          </div>

          {/* Export Button */}
          <div className="export-btn-container">
            <button onClick={() => alert("Exporting compliance report...")}>
              <FileText size={16} /> Export Compliance Report (PDF)
            </button>
          </div>
        </div>
      </main>

      <footer className="compliance-footer">
        <div className="footer-content">
          <span>© 2025 TriNetra | Volkswagen Driver Analytics</span>
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