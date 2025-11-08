import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileDown, BarChart2, AlertTriangle, Clock, 
  User, ChevronLeft, Download, Car 
} from "lucide-react";
// Import images
import virtusImage1 from "../../../assets/vir.jpg";
import virtusImage2 from "../../../assets/tai.jpg";
import virtusImage3 from "../../../assets/taii.jpg";
import virtusImage4 from "../../../assets/car.jpg";



import "./FleetOverview.css";

export default function FleetOverview() {
  const navigate = useNavigate();
  


  // Vehicles data
  const vehicles = [
    {
      id: 1,
      name: "Volkswagen Virtus",
      model: "1.5 TSI GT",
      dashcams: 5,
      status: "Active",
      image: virtusImage1,
    },
    {
      id: 2,
      name: "Volkswagen Virtus",
      model: "GT Plus",
      dashcams: 4,
      status: "Idle",
      image: virtusImage2,
    },
    {
      id: 3,
      name: "Volkswagen Virtus",
      model: "2.0 TSI",
      dashcams: 6,
      status: "Offline",
      image: virtusImage3,
    },
    {
      id: 4,
      name: "Volkswagen Virtus",
      model: "1.5 TSI GT",
      dashcams: 5,
      status: "Active",
      image: virtusImage4,
    },
  ];

  const metrics = {
    totalVehicles: 128,
    hazardsReported: 342,
    averageAlerts: 18,
    activeVehicles: 98,
    complianceRate: 94
  };

  // Navigation handlers
  const handleViewHazards = () => navigate("/dashboard/company/fleet/hazards");
  const handleAnalytics = () => navigate("/dashboard/company/fleet/analytics");
  const handleBack = () => navigate("/dashboard/company");

  return (
    <div className="fleet-page">
      {/* Header */}
      <header className="fleet-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-btn" onClick={handleBack}>
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="header-title">Fleet Overview</div>
              <div className="header-subtitle">Monitor and manage your vehicle fleet</div>
            </div>
          </div>

          <div className="header-right">
           
          </div>
        </div>
      </header>

      <main className="fleet-main">
        <div className="content-container">
          {/* Summary Metrics */}
          <section className="metrics-summary">
            <div className="metric-card">
              <Car size={20} />
              <div className="metric-info">
                <h4>Total Vehicles</h4>
                <p>{metrics.totalVehicles}</p>
              </div>
            </div>
            <div className="metric-card warning">
              <AlertTriangle size={20} />
              <div className="metric-info">
                <h4>Hazards Reported</h4>
                <p>{metrics.hazardsReported}</p>
              </div>
            </div>
            <div className="metric-card info">
              <BarChart2 size={20} />
              <div className="metric-info">
                <h4>Average Alerts/Day</h4>
                <p>{metrics.averageAlerts}</p>
              </div>
            </div>
          </section>

        

          {/* Fleet Grid */}
          <section className="fleet-grid">
            {vehicles.map((vehicle) => (
              <div className="vehicle-card" key={vehicle.id}>
                <div className="vehicle-image">
                  <img src={vehicle.image} alt={vehicle.name} />
                  <span className={`status ${vehicle.status.toLowerCase()}`}>
                    {vehicle.status}
                  </span>
                </div>
                <div className="vehicle-info">
                  <h3>{vehicle.name}</h3>
                  <p>{vehicle.model}</p>
                  <p className="dashcams">{vehicle.dashcams} Dashcams Installed</p>
                </div>

                <div className="vehicle-actions">
                  <button onClick={handleViewHazards} className="hazard-btn">
                    <AlertTriangle size={16} /> Hazards
                  </button>
                  <button onClick={handleAnalytics} className="analytics-btn">
                    <BarChart2 size={16} /> Analytics
                  </button>
                  <button onClick={() => alert("Downloading report...")} className="report-btn">
                    <FileDown size={16} /> Report
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      <footer className="fleet-footer">
        <div className="footer-content">
          <div>© 2025 TriNetra | Volkswagen Fleet Management</div>
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