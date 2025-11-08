import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutUser } from "../../lib/auth";
import "./companyFleetDashboard.css";
import {
  LayoutDashboard,
  AlertTriangle,
  BarChart2,
  Settings,
  Activity,
  Users,
  Car,
  Menu,
  LogOut,
} from "lucide-react";

export default function CompanyFleetDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="company-dashboard">
      {/* ===== Navbar ===== */}
      <header className="company-navbar">
        <div className="navbar-left">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={22} />
          </button>
          <div className="brand">🚗 TriNetra | Company Fleet Dashboard</div>
        </div>

        <div className="navbar-right">
          <div className="live-sync">
            <span className="dot" /> Live Sync Active
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {/* ===== Main Layout ===== */}
      <div className="layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
          <nav>
            <NavLink to="/dashboard/company/fleet" end>
              <LayoutDashboard size={18} /> Overview
            </NavLink>
            <NavLink to="hazards">
              <AlertTriangle size={18} /> View Hazards
            </NavLink>
            <NavLink to="analytics">
              <BarChart2 size={18} /> Analytics & Trends
            </NavLink>
            <NavLink to="fleet-analytics">
              <Activity size={18} /> Fleet Analytics
            </NavLink>
            <NavLink to="maintenance">
              <Settings size={18} /> Maintenance Predictor
            </NavLink>
            <NavLink to="drivers">
              <Users size={18} /> Driver Compliance
            </NavLink>
          </nav>
        </aside>

        {/* Dynamic Page Area */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
