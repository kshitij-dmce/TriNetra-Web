import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ✅ Auth Pages
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";

// ✅ Auth Protection
import ProtectedRoute from "../auth/ProtectedRoute";

// ✅ Government Dashboard Pages
import GovernmentDashboard from "../pages/Dashboard/GovernmentDashboard";
import FleetDashboard from "../pages/Dashboard/FleetDashboard";
import LiveMap from "../pages/Dashboard/GovernmentDashboard/LiveMap";
import HotspotAnalytics from "../pages/Dashboard/GovernmentDashboard/HotspotAnalytics";
import ComplaintsReports from "../pages/Dashboard/GovernmentDashboard/ComplaintsReports";
import ActionMonitoring from "../pages/Dashboard/GovernmentDashboard/ActionMonitoring";
import FleetAnalytics from "../pages/Dashboard/GovernmentDashboard/FleetGovernmentAnalytics";

// ✅ Company Dashboard Pages
import CompanyDashboard from "../pages/Dashboard/CompanyDashboard";
import CompanyFleetDashboard from "../pages/Dashboard/CompanyFleetDashboard";
import FleetOverview from "../pages/Dashboard/CompanyDashboard/FleetOverview";
import ViewHazards from "../pages/Dashboard/CompanyDashboard/ViewHazards";
import AnalyticsTrends from "../pages/Dashboard/CompanyDashboard/AnalyticsTrends";
import MaintenancePredictor from "../pages/Dashboard/CompanyDashboard/MaintenancePredictor";
import DriverCompliance from "../pages/Dashboard/CompanyDashboard/DriverCompliance";

// ✅ Home Pages
import HomePage from "../pages/Home/HomePage";
import TestVideo from "../pages/Home/TestVideo";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<TestVideo />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* --- GOVERNMENT DASHBOARD ROUTES --- */}
      <Route
        path="/dashboard/government"
        element={
          <ProtectedRoute allowedRoles={["government"]}>
            <GovernmentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/fleet"
        element={
          <ProtectedRoute allowedRoles={["government"]}>
            <FleetDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/fleet/map"
        element={
          <ProtectedRoute allowedRoles={["government"]}>
            <LiveMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/fleet/analytics"
        element={
          <ProtectedRoute allowedRoles={["government"]}>
            <HotspotAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/fleet/reports"
        element={
          <ProtectedRoute allowedRoles={["government"]}>
            <ComplaintsReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/fleet/actions"
        element={
          <ProtectedRoute allowedRoles={["government"]}>
            <ActionMonitoring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/fleet/fleet-analytics"
        element={
          <ProtectedRoute allowedRoles={["government"]}>
            <FleetAnalytics />
          </ProtectedRoute>
        }
      />

      {/* --- COMPANY DASHBOARD ROUTES --- */}
      <Route
        path="/dashboard/company"
        element={
          <ProtectedRoute allowedRoles={["company", "volkswagen"]}>
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/company/fleet"
        element={
          <ProtectedRoute allowedRoles={["company", "volkswagen"]}>
            <CompanyFleetDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<FleetOverview />} />
      </Route>

      <Route
        path="/dashboard/company/fleet/hazards"
        element={
          <ProtectedRoute allowedRoles={["company", "volkswagen"]}>
            <ViewHazards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/company/fleet/analytics"
        element={
          <ProtectedRoute allowedRoles={["company", "volkswagen"]}>
            <AnalyticsTrends />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/company/fleet/fleet-analytics"
        element={
          <ProtectedRoute allowedRoles={["company", "volkswagen"]}>
            <FleetAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/company/fleet/maintenance"
        element={
          <ProtectedRoute allowedRoles={["company", "volkswagen"]}>
            <MaintenancePredictor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/company/fleet/drivers"
        element={
          <ProtectedRoute allowedRoles={["company", "volkswagen"]}>
            <DriverCompliance />
          </ProtectedRoute>
        }
      />

      {/* --- FALLBACK --- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
