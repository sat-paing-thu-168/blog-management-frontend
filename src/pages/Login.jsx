import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setLoading(true);

    const result = await login(form.email, form.password);
    console.log("Login result:", result);

    if (result.success) {
      navigate("/posts");
    } else {
      // Handle different error formats
      if (result.error?.errors) {
        // Validation error format: { errors: { field: "message" } }
        setErrors(result.error.errors);
        if (result.error.message) {
          setGeneralError(result.error.message);
        }
      } else if (typeof result.error === "string") {
        // Simple string error: "Invalid Username or password"
        setGeneralError(result.error);
      } else if (result.error?.message) {
        // Error object with message
        setGeneralError(result.error.message);
      } else {
        // Fallback
        setGeneralError("Login failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Login</h2>

              {/* General Error Message (non-field specific) */}
              {generalError && Object.keys(errors).length === 0 && (
                <div className="alert alert-danger" role="alert">
                  {generalError}
                </div>
              )}

              {/* Validation Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="alert alert-danger">
                  <strong>Please fix the following errors:</strong>
                  <ul className="mt-2 mb-0">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Enter your email"
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Enter your password"
                    required
                    value={form.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary text-decoration-none"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
