import React, { useEffect, useState, useRef } from "react";
import "./complaintsReports.css";
import { Download, Eye, CheckCircle, XCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { utils, writeFile } from "xlsx";
import { db } from "../../../lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function ComplaintsReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [viewMedia, setViewMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔔 Alert state
  const [showPopupAlert, setShowPopupAlert] = useState(false);
  const prevReportsLength = useRef(0);

  // ✅ Real-time listener from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "complaints"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          status: d.status || "Pending", // default fallback
        };
      });

      // Show the alert if a new complaint has arrived
      if (prevReportsLength.current !== 0 && data.length > prevReportsLength.current) {
        setShowPopupAlert(true);
        setTimeout(() => setShowPopupAlert(false), 3000);
      }
      prevReportsLength.current = data.length;

      setReports(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Format timestamp from Firestore or string
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      if (timestamp.seconds)
        return new Date(timestamp.seconds * 1000).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      return timestamp.toString();
    } catch {
      return "Invalid date";
    }
  };

  // ✅ Update complaint status in Firestore + UI
  const handleStatusChange = async (id, newStatus) => {
    try {
      const docRef = doc(db, "complaints", id);
      await updateDoc(docRef, { status: newStatus });
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // ✅ Export data to Excel/CSV
  const handleExport = (format) => {
    const data = reports.map((r) => ({
      ID: r.id,
      Hazard: r.hazardType || "N/A",
      Description: r.description || "N/A",
      Timestamp: formatTimestamp(r.timestamp),
      Address: r.address || "N/A",
      Latitude: r.lat || "N/A",
      Longitude: r.lng || "N/A",
      Status: r.status || "Pending",
      User: r.userName || "N/A",
      Phone: r.userPhone || "N/A",
    }));
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Reports");
    writeFile(wb, format === "csv" ? "TriNetra_Reports.csv" : "TriNetra_Reports.xlsx");
  };

  return (
    <div className="reports-page">
      {/* 🔔 POPUP ALERT */}
      {showPopupAlert && (
        <div className="popup-alert">
          <AlertCircle size={20} />
          <span>New complaint received!</span>
        </div>
      )}

      {/* 🔹 Header */}
      <div className="reports-header">
        <div className="reports-header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <h2>🧾 Complaints & Reports</h2>
        </div>

        <div className="actions">
          <button onClick={() => handleExport("csv")} className="btn-export">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => handleExport("xlsx")} className="btn-export">
            <Download size={16} /> Export XLSX
          </button>
        </div>
      </div>

      {/* 🔹 Table */}
      {loading ? (
        <div className="loading">Fetching complaints...</div>
      ) : (
        <div className="reports-table-wrap">
          <table>
            <thead>
              <tr>
                {[
                  "id",
                  "hazard",
                  "description",
                  "timestamp",
                  "address",
                  "status",
                  "image",
                  "action",
                ].map((col) => (
                  <th key={col}>{col.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.hazardType || "N/A"}</td>
                  <td>{r.description || "N/A"}</td>
                  <td>{formatTimestamp(r.timestamp)}</td>
                  <td>
                    {r.address ? (
                      <a
                        href={`https://www.google.com/maps?q=${r.lat},${r.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-link"
                      >
                        {r.address.split(",")[0]}
                      </a>
                    ) : (
                      "No location"
                    )}
                  </td>

                  {/* 🔹 Status */}
                  <td
                    className={`status-cell ${
                      (r.status || "Pending").toLowerCase()
                    }`}
                  >
                    {r.status || "Pending"}
                  </td>

                  {/* 🔹 Image */}
                  <td>
                    {r.imageUrl ? (
                      <button className="img-btn" onClick={() => setViewMedia(r)}>
                        <Eye size={16} />
                      </button>
                    ) : (
                      "No Image"
                    )}
                  </td>

                  {/* 🔹 Action Buttons */}
                  <td className="table-actions">
                    <button
                      title="Mark Resolved"
                      className="action-btn success"
                      onClick={() => handleStatusChange(r.id, "Resolved")}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      title="Mark Unresolved"
                      className="action-btn danger"
                      onClick={() => handleStatusChange(r.id, "Unresolved")}
                    >
                      <XCircle size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Image Modal */}
      {viewMedia && (
        <div className="media-modal" onClick={() => setViewMedia(null)}>
          <div className="media-card" onClick={(e) => e.stopPropagation()}>
            <h3>{viewMedia.hazardType}</h3>
            <p><strong>Description:</strong> {viewMedia.description}</p>
            <p><strong>Address:</strong> {viewMedia.address}</p>
            <p><strong>Timestamp:</strong> {formatTimestamp(viewMedia.timestamp)}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status-chip ${
                  (viewMedia.status || "Pending").toLowerCase()
                }`}
              >
                {viewMedia.status || "Pending"}
              </span>
            </p>
            <img src={viewMedia.imageUrl} alt="Complaint" />
            <button className="btn-close" onClick={() => setViewMedia(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}