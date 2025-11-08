import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Upload,
  AlertTriangle,
  Activity,
  BarChart2,
  MapPin,
} from "lucide-react";
import "./TestVideo.css";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default function TestVideo() {
  const navigate = useNavigate();
  const [showNote, setShowNote] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [location, setLocation] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertAnim, setAlertAnim] = useState(false);

  // Get browser location
  const handleGetLocation = () => {
    if (!window.navigator.geolocation)
      return alert("Geolocation not supported.");
    window.navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => alert("Could not get location."),
      { enableHighAccuracy: true }
    );
  };

  // Handle file upload and size check
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert("Max file size is 5 MB.");
      return;
    }
    setSelectedFile(file);
    setAnalytics(null);
  };

  // Mock results to simulate Flask analytics
  const mockDetectionResults = {
    summary: {
      totalDetections: 8,
      criticalIssues: 2,
      processingTime: "1.2s",
    },
    categories: {
      potholes: { count: 3, severity: "High" },
      debris: { count: 2, severity: "Medium" },
      obstacles: { count: 1, severity: "Low" },
      trafficViolations: { count: 2, severity: "Medium" },
    },
    detections: [
      {
        type: "Pothole",
        location: "2.3s",
        severity: "High",
        confidence: "95%",
      },
      {
        type: "Debris",
        location: "5.1s",
        severity: "Medium",
        confidence: "88%",
      },
      {
        type: "Obstacle",
        location: "8.7s",
        severity: "Critical",
        confidence: "92%",
      },
      {
        type: "Traffic Violation",
        location: "12.4s",
        severity: "Medium",
        confidence: "87%",
      },
    ],
  };

  // Handle video submit (mock for Flask API)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile || !location) {
      alert("Please select video AND get location before submitting!");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setAnalytics(mockDetectionResults);
      setAlertAnim(true);
      setTimeout(() => setAlertAnim(false), 800);
    }, 1800);
  };

  // Fetch alerts from Firestore, filter to coordinates and last 24 hours, within 100m
  useEffect(() => {
  if (!location) return;
  setAlertsLoading(true);
  const db = getFirestore();
  (async () => {
    try {
      const twentyFourHrsAgo = new Date(Date.now() - 24 * 3600 * 1000);
      // Query all alerts newer than 24 hours
      const alertQuery = query(
        collection(db, "live_alerts"),
        where("timestamp", ">", twentyFourHrsAgo)
        // You can also add orderBy('timestamp', 'desc') and limit(n)
      );
      const snapshot = await getDocs(alertQuery);
      const alertsNearby = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        // REAL data from Firestore
        const d = getDistanceMeters(location.lat, location.lng, data.lat, data.long);
        if (d <= 100) alertsNearby.push({ ...data, id: doc.id, distance: d });
      });
      setAlerts(alertsNearby);
    } catch (err) {
      setAlerts([]);
    } finally {
      setAlertsLoading(false);
    }
  })();
}, [location, analytics]);

  function getDistanceMeters(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 10000;
    const toRad = (deg) => deg * Math.PI / 180;
    const R = 6371e3;
    const φ1 = toRad(lat1),
      φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1),
      Δλ = toRad(lon2 - lon1);
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  return (
    <div className="dashcampage-unique">
      {showNote && (
        <div className="dashcammodal-unique-overlay">
          <div className="dashcammodal-unique">
            <AlertTriangle size={28} className="dashcammodal-unique-warning-icon" />
            <h2>Important Prototype Note</h2>
            <p>
              Simulation for dashcam hazard testing only. Your video will be processed at 2FPS and analyzed for hazards. Only hazards near your road will show below from system live alerts.
            </p>
            <p>
              In live use, dashcams/videos and location upload automatically. Get our mobile app for true journey analytics!
            </p>
            <button onClick={() => setShowNote(false)}>I Understand</button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="dashcamheader-unique">
        <div className="dashcamheader-unique-content">
          <div className="dashcamheader-unique-left">
            <button
              className="dashcamheader-unique-backbtn"
              onClick={() => navigate("/")}
            >
              <ChevronLeft size={20} />
              <span>Back to Home</span>
            </button>
            <div className="dashcamheader-unique-info">
              <h1 className="dashcamheader-unique-title">
                Test Dashcam Video
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="dashcammain-unique">
        <div className="dashcamcontainer-unique">
          <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
            <div className="dashcamupload-unique-box">
              <Upload size={48} />
              <h3>Upload Dashcam Video</h3>
              <p>
                Drag & drop your video (Max 5MB) or click to browse. Will be sampled at 2FPS for analysis.
              </p>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                id="video-upload-unique"
              />
              {selectedFile && (
                <div className="dashcamselected-unique-file">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
            <button
              type="submit"
              className="dashcamsubmit-unique-btn"
              disabled={!selectedFile || isProcessing || !location}
            >
              {isProcessing ? "Processing Video..." : "Process Video"}
            </button>
          </form>

          {/* Location Button */}
          {!location ? (
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <button
                className="dashcamlocation-unique-btn"
                type="button"
                onClick={handleGetLocation}
              >
                <MapPin size={22} style={{ marginRight: 6, verticalAlign: "middle" }} />
                Get your current location
              </button>
              <div className="dashcamlocation-desc-unique">
                <span>(Hazard alerts are filtered for your current location only)</span>
              </div>
            </div>
          ) : (
            <div className="dashcamlocation-confirm-unique">
              <MapPin size={18} />
              <span>
                Location set: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </span>
            </div>
          )}

          {/* Analytics Results */}
          {analytics && (
            <div className="dashcamanalytics-unique">
              <div className="dashcamanalytics-unique-header">
                <Activity size={20} />
                <h3>Detection Analysis</h3>
                <span className="dashcamanalytics-unique-processingtime">
                  Processing Time: {analytics.summary.processingTime}
                </span>
              </div>

              <div className="dashcamanalytics-unique-summarystats">
                <div className="dashcamanalytics-unique-statcard total">
                  <BarChart2 size={20} />
                  <div>
                    <h4>Total Detections</h4>
                    <p>{analytics.summary.totalDetections}</p>
                  </div>
                </div>
                <div className="dashcamanalytics-unique-statcard critical">
                  <AlertTriangle size={20} />
                  <div>
                    <h4>Critical Issues</h4>
                    <p>{analytics.summary.criticalIssues}</p>
                  </div>
                </div>
              </div>

              <div className="dashcamanalytics-unique-categorysection">
                <h4>Detection Categories</h4>
                <div className="dashcamanalytics-unique-categorygrid">
                  {Object.entries(analytics.categories).map(([key, value]) => (
                    <div key={key} className="dashcamanalytics-unique-categorycard">
                      <div className="category-header">
                        <span className="category-name">{key}</span>
                        <span className={`category-severity ${value.severity.toLowerCase()}`}>
                          {value.severity}
                        </span>
                      </div>
                      <p className="category-count">{value.count}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashcamanalytics-unique-detectionstable">
                <h4>Detection Timeline</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Timestamp</th>
                      <th>Severity</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.detections.map((detection, index) => (
                      <tr key={index}>
                        <td>{detection.type}</td>
                        <td>{detection.location}</td>
                        <td className={`severity-${detection.severity.toLowerCase()}`}>{detection.severity}</td>
                        <td className="confidence">{detection.confidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Live alerts */}
          <div className="dashcamalerts-unique-section">
            <h3 style={{ marginBottom: 12, color: "#04312B", fontWeight: 700 }}>
              Live Hazard Alerts (Nearby)
            </h3>
            {alertsLoading ? (
              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <span>Loading alerts...</span>
              </div>
            ) : alerts.length > 0 ? (
              <div className={`dashcamalerts-unique-list${alertAnim ? " dashcamalert-unique-new-anim" : ""}`}>
                {alerts.map((alert, idx) => (
                  <div className={`dashcamalerts-unique-item${alertAnim && idx === 0 ? " dashcamalerts-unique-pop" : ""}`} key={alert.id}>
                    <div className="dashcamalerts-unique-type">
                      <AlertTriangle size={18} color={alert.severity === "critical" ? "#d81c1c" : "#eab308"} />
                      <span className={`dashcamalerts-unique-severity dashcamalerts-unique-severity-${alert.severity}`}>
                        {alert.alert_type}
                      </span>
                    </div>
                    <div className="dashcamalerts-unique-box">
                      <span>{alert.message ? alert.message : "Hazard detected"}</span>
                      <strong style={{ color: "#016b51", marginLeft: 8 }}>
                        ({alert.distance.toFixed(0)}m ahead)
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#018161", marginTop: 30 }}>
                <strong>No alert hazards within 100 metres. All clear!</strong>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}