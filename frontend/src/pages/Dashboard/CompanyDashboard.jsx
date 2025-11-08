import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../lib/auth";
import { 
  Clock, User, LogOut, BarChart2, 
  FileText, Car, AlertTriangle, Settings,
  TrendingUp, Truck, Users, Activity
} from "lucide-react";
import "./CompanyDashboard.css";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigationCards = [
    {
      title: "Fleet Overview",
      description: "Monitor your fleet status and performance",
      icon: Truck,
      path: "/dashboard/company/fleet",
      stats: "128 Vehicles"
    },
    {
      title: "View Hazards",
      description: "Track and manage safety incidents",
      icon: AlertTriangle,
      path: "/dashboard/company/fleet/hazards",
      stats: "3 Active Alerts"
    },
    {
      title: "Analytics Trends",
      description: "Review performance metrics and insights",
      icon: BarChart2,
      path: "/dashboard/company/fleet/analytics",
      stats: "Updated 5m ago"
    },
    {
      title: "Driver Compliance",
      description: "Monitor driver behavior and compliance",
      icon: Users,
      path: "/dashboard/company/fleet/drivers",
      stats: "94% Compliant"
    }
  ];

  const recentActivities = [
    {
      type: "warning",
      text: "Vehicle A12 reported high emissions",
      time: "5 minutes ago"
    },
    {
      type: "success",
      text: "Monthly compliance report generated",
      time: "1 hour ago"
    },
    {
      type: "info",
      text: "System maintenance completed",
      time: "2 hours ago"
    }
  ];

  return (
    <div className="company-dash">
      <header className="company-header">
        <div className="header-content">
          <div className="header-left">
            <div className="company-brand">TRINETRA</div>
            <div className="company-subtitle">Company Portal</div>
          </div>

          <div className="header-right">
           
           
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="company-main">
        <div className="main-container">
          {/* Overview Section */}
          <section className="overview-section">
            <div className="overview-header">
              <h1>Company Dashboard</h1>
              <p>Manage your fleet and monitor performance metrics</p>
            </div>

            {/* Navigation Cards */}
            <div className="nav-grid">
              {navigationCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div 
                    key={index} 
                    className="nav-card"
                    onClick={() => navigate(card.path)}
                  >
                    <div className="card-icon">
                      <Icon size={24} />
                    </div>
                    <div className="card-content">
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                      <div className="card-stats">{card.stats}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Analytics Section */}
          <section className="analytics-section">
            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="card-header">
                  <h3>Recent Activities</h3>
                  <Activity size={20} />
                </div>
                <div className="activities-list">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className={`activity-dot ${activity.type}`}></div>
                      <div className="activity-content">
                        <span className="activity-text">{activity.text}</span>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="view-all-btn"
                  onClick={() => navigate('/dashboard/company/fleet')}
                >
                  View All Activities
                </button>
              </div>

              <div className="analytics-card">
                <div className="card-header">
                  <h3>Quick Actions</h3>
                  <Settings size={20} />
                </div>
                <div className="action-buttons">
                  <button 
                    className="action-btn primary"
                    onClick={() => navigate('/dashboard/company/fleet')}
                  >
                    <Truck size={18} />
                    Fleet Overview
                  </button>
                  <button 
                    className="action-btn warning"
                    onClick={() => navigate('/dashboard/company/fleet/hazards')}
                  >
                    <AlertTriangle size={18} />
                    View Hazards
                  </button>
                  <button 
                    className="action-btn info"
                    onClick={() => navigate('/dashboard/company/fleet/analytics')}
                  >
                    <BarChart2 size={18} />
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="company-footer">
        <div className="footer-content">
          <span>© 2025 TriNetra | Volkswagen Mobility Analytics</span>
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