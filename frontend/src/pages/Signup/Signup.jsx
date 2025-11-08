import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Clock, User, ChevronLeft } from "lucide-react";
import { signupWithEmail } from "../../lib/auth";
import "./signup.css";

export default function SignupPage() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    empId: "",
    password: "",
    confirmPassword: "",
    role: "volkswagen"
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);



  const validateForm = () => {
    const errors = {};
    if (!form.fullName || form.fullName.trim().length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    }
    
    if (!form.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Invalid email format";
    }
    
    if (!form.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{10,}$/.test(form.phone)) {
      errors.phone = "Enter a valid phone number";
    }
    
    if (!form.empId) {
      errors.empId = "Employee/Government ID is required";
    } else if (form.empId.length < 4) {
      errors.empId = "ID must be at least 4 characters";
    }
    
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(form.password)) {
      errors.password = "Include uppercase, lowercase & numbers";
    }
    
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm password";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    setResult(null);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const validationErrors = validateForm();
    if (validationErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      empId: true,
      password: true,
      confirmPassword: true
    });

    if (Object.keys(validationErrors).length === 0) {
      setSubmitting(true);
      setResult(null);

      try {
        const { user, profile } = await signupWithEmail({
          email: form.email.trim().toLowerCase(),
          password: form.password,
          displayName: form.fullName.trim(),
          role: form.role,
          extra: {
            phone: form.phone.trim(),
            empId: form.empId.trim()
          }
        });

        setResult({
          ok: true,
          message: "Account created successfully! Redirecting..."
        });

        // Clear form
        setForm({
          fullName: "",
          email: "",
          phone: "",
          empId: "",
          password: "",
          confirmPassword: "",
          role: "volkswagen"
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } catch (error) {
        setResult({
          ok: false,
          message: error.message || "Failed to create account"
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <header className="auth-headers">
        <div className="header-contents">
          <div className="header-lefts">
            <button 
              className="back-btns" 
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="brand">TRINETRA</div>
          </div>
          
          <div className="header-rights">
           
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Create Account</h1>
              <p>Join our secure vehicle monitoring platform</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {result && (
                <div className={`auth-result ${result.ok ? 'success' : 'error'}`}>
                  {result.message}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.fullName && touched.fullName ? "error" : ""}
                />
                {errors.fullName && touched.fullName && (
                  <span className="error-message">{errors.fullName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email && touched.email ? "error" : ""}
                />
                {errors.email && touched.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.phone && touched.phone ? "error" : ""}
                  />
                  {errors.phone && touched.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="empId">Employee ID</label>
                  <input
                    id="empId"
                    name="empId"
                    type="text"
                    placeholder="Enter employee ID"
                    value={form.empId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.empId && touched.empId ? "error" : ""}
                  />
                  {errors.empId && touched.empId && (
                    <span className="error-message">{errors.empId}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.password && touched.password ? "error" : ""}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="password-input">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.confirmPassword && touched.confirmPassword ? "error" : ""}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="role">Select Role</label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="volkswagen">Volkswagen Employee</option>
                  <option value="government">Government Official</option>
                </select>
              </div>

              <button 
                type="submit" 
                className={`auth-button ${submitting ? 'loading' : ''}`}
                disabled={submitting}
              >
                {submitting ? "Creating Account..." : "Create Account"}
              </button>

              <div className="auth-links">
                <span>Already have an account?</span>
                <a href="/login">Sign In</a>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <div className="footer-container">
          <div className="footer-content">
            <span>© {new Date().getFullYear()} TriNetra. All rights reserved.</span>
            <div className="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}