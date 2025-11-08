import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../lib/auth";
import { 
  Clock, User, LogOut, BarChart2, 
  AlertTriangle, Car, Shield, Activity,
  TrendingUp, MapPin, Settings, ChevronRight,
  Users, FileText, Bell, PieChart
} from "lucide-react";
import "./dashboard.css";

export default function GovernmentDashboard() {
    const navigate = useNavigate();


    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const navigationLinks = [
        { path: '/dashboard/fleet/map', label: 'Live Map', icon: MapPin },
        { path: '/dashboard/fleet/analytics', label: 'Hotspot Analytics', icon: PieChart },
        { path: '/dashboard/fleet/reports', label: 'Complaints', icon: FileText },
        { path: '/dashboard/fleet/actions', label: 'Action Monitoring', icon: Activity },
        { path: '/dashboard/fleet/fleet-analytics', label: 'Fleet Analytics', icon: BarChart2 }
    ];

    const analytics = {
        totalVehicles: 128,
        activeVehicles: 98,
        alerts: 12,
        criticalAlerts: 3,
        safetyScore: 85,
        systemUptime: 99.8,
        recentActivities: [
            { type: 'warning', text: 'New hazard reported in Sector B', time: '5 mins ago' },
            { type: 'success', text: 'Complaint #123 resolved', time: '15 mins ago' },
            { type: 'info', text: 'System maintenance completed', time: '1 hour ago' }
        ]
    };

    return (
        <div className="dash-page">
            {/* Header */}
            <header className="dash-header">
                <div className="dash-header-content">
                    <div className="dash-header-left">
                        <div className="dash-brand">TRINETRA</div>
                        <div className="dash-subtitle">Government Analytics Panel</div>
                    </div>

                    <div className="dash-header-right">
                       
                        <button className="dash-logout" onClick={handleLogout}>
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="dash-main">
                <div className="dash-container">
                    {/* Overview Section */}
                    <section className="dash-overview">
                        <div className="overview-header">
                            <h1>Government Dashboard</h1>
                            <p>Real-time vehicle monitoring and safety analytics</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="stats-grid">
                            <div className="stat-card primary">
                                <Car className="stat-icon" />
                                <div className="stat-info">
                                    <div className="stat-value">{analytics.totalVehicles}</div>
                                    <div className="stat-label">Connected Vehicles</div>
                                </div>
                                <div className="stat-trend positive">
                                    <TrendingUp size={16} />
                                    <span>+12%</span>
                                </div>
                            </div>

                            <div className="stat-card warning">
                                <AlertTriangle className="stat-icon" />
                                <div className="stat-info">
                                    <div className="stat-value">{analytics.alerts}</div>
                                    <div className="stat-label">Active Alerts</div>
                                </div>
                                <div className="stat-trend negative">
                                    <TrendingUp size={16} />
                                    <span>+3</span>
                                </div>
                            </div>

                            <div className="stat-card success">
                                <Shield className="stat-icon" />
                                <div className="stat-info">
                                    <div className="stat-value">{analytics.safetyScore}%</div>
                                    <div className="stat-label">Safety Score</div>
                                </div>
                                <div className="stat-trend positive">
                                    <TrendingUp size={16} />
                                    <span>+5%</span>
                                </div>
                            </div>

                            <div className="stat-card info">
                                <Activity className="stat-icon" />
                                <div className="stat-info">
                                    <div className="stat-value">{analytics.systemUptime}%</div>
                                    <div className="stat-label">System Uptime</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Navigation Cards */}
                    <section className="nav-section">
                        <div className="nav-grid">
                            {navigationLinks.map((link, index) => {
                                const Icon = link.icon;
                                return (
                                    <div 
                                        key={index}
                                        className="nav-card"
                                        onClick={() => navigate(link.path)}
                                    >
                                        <Icon size={24} />
                                        <span>{link.label}</span>
                                        <ChevronRight size={20} className="nav-arrow" />
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Analytics Cards */}
                    <section className="analytics-section">
                        <div className="analytics-grid">
                            <div className="analytics-card">
                                <div className="card-header">
                                    <h3>Recent Activities</h3>
                                    <Bell size={20} />
                                </div>
                                <div className="activities-list">
                                    {analytics.recentActivities.map((activity, index) => (
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
                                    onClick={() => navigate('/dashboard/fleet')}
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
                                        onClick={() => navigate('/dashboard/fleet/map')}
                                    >
                                        <MapPin size={18} />
                                        View Live Map
                                    </button>
                                    <button 
                                        className="action-btn warning"
                                        onClick={() => navigate('/dashboard/fleet/analytics')}
                                    >
                                        <AlertTriangle size={18} />
                                        View Hotspots
                                    </button>
                                    <button 
                                        className="action-btn info"
                                        onClick={() => navigate('/dashboard/fleet/fleet-analytics')}
                                    >
                                        <BarChart2 size={18} />
                                        Fleet Analytics
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="dash-footer">
                <div className="dash-footer-content">
                    <div className="footer-info">
                        © 2025 TriNetra | Ministry of Transport
                    </div>
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