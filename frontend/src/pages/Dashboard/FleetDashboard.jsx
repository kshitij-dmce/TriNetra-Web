import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, MapPin, BarChart2, FileText, Settings, 
  Car, Home, Activity, Clock, User, AlertCircle
} from "lucide-react";
import { 
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer 
} from 'recharts';
import { db } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "./fleetDashboard.css";

export default function FleetDashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(true);


  // Chart Data
  const [hazardData, setHazardData] = useState([
    { name: 'Potholes', value: 35 },
    { name: 'Debris', value: 25 },
    { name: 'Accidents', value: 15 },
    { name: 'Traffic', value: 25 }
  ]);
  const [trendData, setTrendData] = useState([
    { name: 'Mon', incidents: 12 },
    { name: 'Tue', incidents: 19 },
    { name: 'Wed', incidents: 15 },
    { name: 'Thu', incidents: 22 },
    { name: 'Fri', incidents: 18 },
    { name: 'Sat', incidents: 14 },
    { name: 'Sun', incidents: 10 }
  ]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Pop-up Alert for new complaints
  const [showPopupAlert, setShowPopupAlert] = useState(false);
  const prevComplaintsLen = useRef(0);

  // Listen for new complaints in Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "complaints"), (snapshot) => {
      const complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (
        prevComplaintsLen.current !== 0 &&
        complaints.length > prevComplaintsLen.current
      ) {
        setShowPopupAlert(true);
        setTimeout(() => setShowPopupAlert(false), 3000);
      }
      prevComplaintsLen.current = complaints.length;
      // You can add a logic here to update hazardData/trendData from complaints!
    });
    return () => unsubscribe();
  }, []);

  // Simulated chart data update (unchanged)
  const generateNewData = () => {
    const newHazardData = hazardData.map(item => ({
      ...item,
      value: Math.floor(Math.random() * 40) + 10
    }));

    const newTrendData = trendData.map(item => ({
      ...item,
      incidents: Math.floor(Math.random() * 25) + 5
    }));

    setHazardData(newHazardData);
    setTrendData(newTrendData);
  };
  useEffect(() => {
    const dataTimer = setInterval(() => {
      generateNewData();
    }, 5000);

    return () => clearInterval(dataTimer);
  }, []);

  return (
    <div className="fleet-dash">
      {/* 🔔 POPUP ALERT */}
      {showPopupAlert && (
        <div className="popup-alert-fleet">
          <AlertCircle size={20} />
          <span>New complaint received!</span>
        </div>
      )}

      <header className="fleet-nav">
        <div className="fleet-nav-left">
          <div className="fleet-brand">TRINETRA</div>
        </div>
        <div className="fleet-nav-right">
          <div className="fleet-live-status">
            <span className="fleet-status-dot" />
            Live
          </div>
          <button className="fleet-notify-btn" aria-label="Notifications">
            <Bell size={18} />
            <span className="fleet-notify-badge">3</span>
          </button>
        </div>
      </header>

      <aside className={`fleet-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <nav className="fleet-side-nav">
          <a href="#" className="fleet-nav-link active">
            <Home size={18}/> 
            <span>Overview</span>
          </a>
          <a href="/dashboard/fleet/map" className="fleet-nav-link">
            <MapPin size={18}/>
            <span>Live Map</span>
          </a>
          <a href="/dashboard/fleet/analytics" className="fleet-nav-link">
            <BarChart2 size={18}/>
            <span>Analytics</span>
          </a>
          <a href="/dashboard/fleet/reports" className="fleet-nav-link">
            <FileText size={18}/>
            <span>Reports</span>
          </a>
          <a href="/dashboard/fleet/actions" className="fleet-nav-link">
            <Settings size={18}/>
            <span>Fleet Data</span>
          </a>
        </nav>
      </aside>

      <main className="fleet-main">
        <div className="fleet-metric-grid">
          <div className="fleet-metric-card">
            <h3>Total Hazards</h3>
            <div className="fleet-metric-value">245</div>
            <div className="fleet-trend positive">↑ 12%</div>
          </div>
          <div className="fleet-metric-card">
            <h3>Active Alerts</h3>
            <div className="fleet-metric-value">18</div>
            <div className="fleet-trend negative">↑ 5%</div>
          </div>
          <div className="fleet-metric-card">
            <h3>Resolved</h3>
            <div className="fleet-metric-value">190</div>
            <div className="fleet-trend positive">↑ 28%</div>
          </div>
          <div className="fleet-metric-card">
            <h3>Pending</h3>
            <div className="fleet-metric-value">37</div>
            <div className="fleet-trend neutral">↔ 0%</div>
          </div>
        </div>

        <div className="fleet-chart-grid">
          <div className="fleet-chart-card">
            <div className="fleet-chart-header">
              <h3 className="fleet-chart-title">Hazard Distribution</h3>
              <select className="fleet-time-select">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="fleet-chart-area">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={hazardData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {hazardData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="fleet-chart-card">
            <div className="fleet-chart-header">
              <h3 className="fleet-chart-title">Weekly Trend</h3>
              <select className="fleet-time-select">
                <option>This Week</option>
                <option>Last Week</option>
                <option>Last Month</option>
              </select>
            </div>
            <div className="fleet-chart-area">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="incidents" 
                    stroke="#0088FE" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}