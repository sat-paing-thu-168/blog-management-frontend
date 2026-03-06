import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, user } = useAuth(); // Add user from context
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect to posts
  useEffect(() => {
    console.log("Register page - checking user:", user);
    if (user) {
      console.log("User already logged in, redirecting to /posts");
      navigate("/posts");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    // Client-side validation
    if (form.password !== form.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    if (form.password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      return;
    }

    setLoading(true);
    const { confirmPassword, ...userData } = form;

    console.log("Sending registration data:", userData);
    const result = await registerUser(userData);
    console.log("Registration result:", result);

    if (result.success) {
      console.log("Registration successful, navigating to /posts");
      // Force navigation with replace
      navigate("/posts", { replace: true });
    } else {
      console.log("Registration failed:", result.error);
      // Handle backend validation errors
      if (result.error?.errors) {
        setErrors(result.error.errors);
        setGeneralError(result.error.message || "Validation failed");
      } else if (result.error?.message) {
        setGeneralError(result.error.message);
      } else {
        setGeneralError(result.error || "Registration failed");
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
              <h2 className="text-center mb-4">Register</h2>

              {/* General Error Message */}
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
                {/* Name Field */}
                <div className="mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    required
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
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
                    required
                    value={form.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                  {!errors.password && (
                    <small className="text-muted">
                      Password must be at least 6 characters
                    </small>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="mb-3">
                  <label className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
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
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-primary text-decoration-none">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
