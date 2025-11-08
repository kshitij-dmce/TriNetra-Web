import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginWithEmail } from "../../lib/auth";
import "./login.css";

const initialState = {
  email: "",
  password: "",
  role: "volkswagen",
  remember: false,
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Validation functions
  const validateEmail = (v) => {
    if (!v) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(v) ? "" : "Enter a valid email";
  };

  const validatePassword = (v) => {
    if (!v) return "Password is required";
    if (v.length < 6) return "Minimum 6 characters";
    return "";
  };

  const getValidationErrors = (f) => {
    const e = {};
    const emailErr = validateEmail(f.email);
    if (emailErr) e.email = emailErr;
    const pwErr = validatePassword(f.password);
    if (pwErr) e.password = pwErr;
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === "checkbox" ? checked : value;
    setForm((p) => ({ ...p, [name]: v }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors(getValidationErrors(form));
  };

  const isFormValid = useMemo(() => {
    return Object.keys(getValidationErrors(form)).length === 0;
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const eobj = getValidationErrors(form);
    setErrors(eobj);

    if (Object.keys(eobj).length > 0) {
      setResult({ ok: false, message: "Please fix validation errors" });
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const { user, profile } = await loginWithEmail({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        remember: form.remember,
      });

      if (!profile) {
        setResult({
          ok: false,
          message: "User profile not found. Please contact support.",
        });
        return;
      }

      const registeredRole = profile.role;
      if (form.role !== registeredRole) {
        setResult({
          ok: false,
          message: `Access denied. You are registered as a ${registeredRole} user.`,
        });
        return;
      }

      setResult({ ok: true, message: `Logged in as ${user.email}` });
      setForm((p) => ({ ...p, password: "" }));
      setTouched({});
      setErrors({});

      if (registeredRole === "government") {
        navigate("/dashboard/government");
      } else if (registeredRole === "volkswagen" || registeredRole === "company") {
        navigate("/dashboard/company");
      } else {
        setResult({
          ok: false,
          message: "Access restricted - invalid role",
        });
        return;
      }
    } catch (err) {
      let friendlyMessage = "Unable to login. Please try again.";

      if (
        err.code === "auth/invalid-login-credentials" ||
        err.code === "auth/wrong-password"
      ) {
        friendlyMessage = "Invalid email or password. Please check your credentials.";
      } else if (err.code === "auth/user-not-found") {
        friendlyMessage = "No account found with this email. Please sign up first.";
      } else if (err.code === "auth/too-many-requests") {
        friendlyMessage = "Too many failed attempts. Please wait a few minutes and try again.";
      } else if (err.code === "auth/network-request-failed") {
        friendlyMessage = "Network error. Please check your internet connection.";
      }

      setResult({ ok: false, message: friendlyMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <header className="auth-header">
        <div className="header-container">
          <div className="header-left">
            <div className="brand">TRINETRA</div>
          </div>
          <div className="header-right"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Sign in to continue to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {result && (
                <div
                  className={`auth-result ${result.ok ? "success" : "error"}`}
                  role="alert"
                >
                  {result.message}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
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

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
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
                <label htmlFor="role">Select Role</label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="volkswagen">Volkswagen Employee</option>
                  <option value="government">Government Official</option>
                </select>
              </div>

              <button
                type="submit"
                className={`auth-button ${submitting ? "loading" : ""}`}
                disabled={submitting || !isFormValid}
              >
                {submitting ? "Signing in..." : "Sign In"}
              </button>

              <div className="auth-links">
                <span>Don't have an account?</span>
                <a href="/signup">Create Account</a>
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
