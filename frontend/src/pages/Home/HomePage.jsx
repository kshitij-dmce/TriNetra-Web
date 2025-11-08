import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, User } from "lucide-react";
import "./HomePage.css";
import carImage from "../../assets/carr.jpg";

export default function HomePage() {
  const navigate = useNavigate();


  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="home-header-content">
          <div className="home-brand">TRINETRA</div>
          <div className="home-header-right">
           
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        <div className="home-background" style={{ backgroundImage: `url(${carImage})` }}>
          <div className="home-overlay"></div>
          <div className="home-content">
            <div className="home-welcome-box">
              <h1>Welcome to TriNetra</h1>
              <p>Advanced Vehicle Monitoring & Safety Platform</p>
              <div className="home-buttons">
                <div className="button-row">
                  <button 
                    className="home-btn primary"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </button>
                  <button 
                    className="home-btn secondary"
                    onClick={() => navigate('/signup')}
                  >
                    Create Account
                  </button>
                </div>
                <button 
                  className="home-btn test-video"
                  onClick={() => navigate('/Test')}
                >
                  Test Dashcam Video
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-content">
          <div className="home-footer-info">
            <span>© {new Date().getFullYear()} TriNetra</span>
            <span>Secure Vehicle Monitoring</span>
          </div>
          <div className="home-footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}