import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, MapPin, Image as ImageIcon, Video, X } from "lucide-react";
import "./TestVideo.css";

const FLASK_FRAME_URL = "https://trinetraa.duckdns.org/frame";

export default function TestVideo() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [location, setLocation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [noHazard, setNoHazard] = useState(false);
  const [showNote, setShowNote] = useState(true);

  useEffect(() => {
    // Automatically show note when page loads
    setShowNote(true);
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Could not get location."),
      { enableHighAccuracy: true }
    );
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const type = file.type.startsWith("video")
      ? "video"
      : file.type.startsWith("image")
      ? "image"
      : null;

    if (!type) {
      alert("Please upload only an image or video file.");
      return;
    }

    if (type === "video" && file.size > 5 * 1024 * 1024) {
      alert("Video file too large. Max 5MB.");
      return;
    }
    if (type === "image" && file.size > 1 * 1024 * 1024) {
      alert("Image file too large. Max 1MB.");
      return;
    }

    setSelectedFile(file);
    setFileType(type);
    setResults([]);
    setError("");
    setNoHazard(false);
  };

  const processImage = async () => {
    if (!selectedFile || !location) return;
    setIsProcessing(true);
    setProgress(0);
    setNoHazard(false);

    const coords = `${location.lat.toFixed(5)}_${location.lng.toFixed(5)}`;
    const fileNameWithCoords = `${coords}_${selectedFile.name}`;
    const formData = new FormData();
    formData.append("file", selectedFile, fileNameWithCoords);

    try {
      const response = await fetch(FLASK_FRAME_URL, { method: "POST", body: formData });
      const data = await response.json();

      if (data.alert_type && data.alert_type.trim() !== "") {
  const vehicles =
    Array.isArray(data.vehicles_detected) && data.vehicles_detected.length > 0
      ? data.vehicles_detected.join(", ")
      : "No vehicle detected";
        setResults([
          {
            frame: 1,
            vehicle_detected: vehicles,
            alert_type: data.alert_type,
            timestamp: new Date().toLocaleString(),
          },
        ]);
      } else {
        setNoHazard(true);
      }
    } catch (err) {
      setError("Error uploading image.");
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const processVideo = async () => {
    if (!selectedFile || !location) return;
    setIsProcessing(true);
    setResults([]);
    setProgress(0);
    setNoHazard(false);

    const videoURL = URL.createObjectURL(selectedFile);
    const video = document.createElement("video");
    video.src = videoURL;
    video.crossOrigin = "anonymous";

    await new Promise((resolve) => {
      video.onloadedmetadata = resolve;
      video.load();
    });

    const fps = 1;
    const duration = video.duration;
    const totalFrames = Math.floor(duration * fps);
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    const coords = `${location.lat.toFixed(5)}_${location.lng.toFixed(5)}`;
    let output = [];

    for (let i = 0; i < totalFrames; i++) {
      const time = i / fps;
      video.currentTime = time;
      await new Promise((r) => (video.onseeked = r));

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.8));

      const frameFileName = `${coords}_frame_${i + 1}.jpg`;
      const formData = new FormData();
      formData.append("file", blob, frameFileName);

      try {
        const response = await fetch(FLASK_FRAME_URL, { method: "POST", body: formData });
        const data = await response.json();

        if (data.alert_type && data.alert_type.trim() !== "") {
  const vehicles =
    Array.isArray(data.vehicles_detected) && data.vehicles_detected.length > 0
      ? data.vehicles_detected.join(", ")
      : "No vehicle detected";

          output.push({
            frame: i + 1,
            vehicle_detected: vehicles,
            alert_type: data.alert_type,
            timestamp: new Date().toLocaleString(),
          });
        }
      } catch (err) {
        console.error("Error processing frame", i + 1, err);
      }

      setProgress(((i + 1) / totalFrames) * 100);
    }

    setResults(output);
    setIsProcessing(false);
    if (output.length === 0) setNoHazard(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !location) {
      setError("Please select a file and get location first.");
      return;
    }
    setError("");
    if (fileType === "image") await processImage();
    else await processVideo();
  };

  return (
    <div className="dashcampage-unique">
      {/* 🌟 Note Popup Card */}
      {showNote && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fff3cd",
            color: "#856404",
            border: "1px solid #ffeeba",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            padding: "18px 20px",
            maxWidth: "450px",
            zIndex: 9999,
            textAlign: "left",
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: "16px" }}>📢 Important Note</strong>
            <X
              size={18}
              style={{ cursor: "pointer", color: "#856404" }}
              onClick={() => setShowNote(false)}
            />
          </div>
          <p style={{ marginTop: "8px", fontSize: "14px", lineHeight: "1.5" }}>
            For the <b>Prototype Submission Phase</b>, this dashboard allows you to test our deployed models
            and view results directly here. In real-time, this process will be executed through the{" "}
            <b>Dashcam system</b> shown in our simulation video. <br />
            Before sending alerts, please download and install our mobile application:
          </p>
          <a
            href="https://drive.google.com/file/d/117bI_oKGRi0Xalrya4rP_HsiW8sZJF3k/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "8px",
              color: "#0056b3",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            📱 Download APK
          </a>
        </div>
      )}

      {/* Header */}
      <header className="dashcamheader-unique7">
        <div className="dashcamheader-unique-content">
          <button onClick={() => navigate("/")} className="dashcamheader-unique-backbtn">
            ← Back
          </button>
          <h1 className="dashcamheader-unique-title">Test Dashcam Media</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashcammain-unique">
        {/* existing code unchanged */}
        <form onSubmit={handleSubmit} className="dashcamform-unique">
          <div className="dashcamupload-unique-box">
            <Upload size={44} />
            <h3>Upload Image or Video</h3>
            <p>Video ≤ 5MB, Image ≤ 1MB</p>
            <input type="file" accept="video/*,image/*" onChange={handleFileSelect} />
            {selectedFile && (
              <div className="dashcamselected-unique-file">
                {fileType === "video" ? <Video size={16} /> : <ImageIcon size={16} />}
                &nbsp;{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          {!location ? (
            <button type="button" className="dashcamlocation-unique-btn" onClick={handleGetLocation}>
              <MapPin size={18} /> Get Location
            </button>
          ) : (
            <div className="dashcamlocation-confirm-unique">
              <MapPin size={16} />
              Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </div>
          )}

          <button
            type="submit"
            className="dashcamsubmit-unique-btn"
            disabled={!selectedFile || !location || isProcessing}
          >
            {isProcessing ? `Processing... ${progress.toFixed(0)}%` : "Start Processing"}
          </button>

          {isProcessing && (
            <div className="progress-bar-unique">
              <div className="progress-inner" style={{ width: `${progress}%` }}></div>
            </div>
          )}

          {error && <div className="dashcamerror-unique">{error}</div>}
        </form>

        {!isProcessing && (
          <div className="dashcamresults-unique">
            {results.length > 0 ? (
              <>
                <h3>⚠️ Detected Hazards</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Frame #</th>
                      <th>Vehicles Detected</th>
                      <th>Alert Type</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td>{r.frame}</td>
                        <td>{r.vehicle_detected}</td>
                        <td>{r.alert_type}</td>
                        <td>{r.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : noHazard ? (
              <div className="no-hazard-msg">✅ No hazard detected in this video/image</div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
