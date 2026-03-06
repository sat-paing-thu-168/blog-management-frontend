import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/axios";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    createdBy: user?.id,
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setLoading(true);

    try {
      await api.post("/blogs", formData);
      navigate("/posts");
    } catch (err) {
      console.log("Error response:", err.response?.data);

      const errorData = err.response?.data;

      // Case 1: Validation errors with 'errors' object
      if (
        err.response?.status === 400 &&
        errorData?.errors &&
        Object.keys(errorData.errors).length > 0
      ) {
        setErrors(errorData.errors);
        setGeneralError(errorData.message || "Validation failed");
      }
      // Case 2: Blog already exists error (status 404 or 400 with message only)
      else if (errorData?.message) {
        // Check if it's a duplicate title error
        if (errorData.message.includes("already exists")) {
          setErrors({ title: errorData.message });
        } else {
          setGeneralError(errorData.message);
        }
      }
      // Case 3: Any other error
      else {
        setGeneralError("Failed to create post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/posts">
            BlogApp
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/posts">
                  Posts
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/posts/create">
                  Create Post
                </Link>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <span className="text-white me-3">
                Welcome, {user?.name || user?.email}
              </span>
              <button onClick={logout} className="btn btn-outline-light btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-header bg-white">
                <h4 className="mb-0">Create New Post</h4>
              </div>

              <div className="card-body">
                {/* General Error Message (shown when no field-specific errors) */}
                {generalError && Object.keys(errors).length === 0 && (
                  <div className="alert alert-danger" role="alert">
                    {generalError}
                  </div>
                )}

                {/* Validation Summary */}
                {Object.keys(errors).length > 0 && (
                  <div className="alert alert-danger">
                    <strong>Please fix the following error:</strong>
                    <ul className="mt-2 mb-0">
                      {Object.entries(errors).map(([field, message]) => (
                        <li key={field}>{message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Title Field */}
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label fw-semibold">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${errors.title ? "is-invalid" : ""}`}
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter post title (3-200 characters)"
                      required
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </div>

                  {/* Description Field */}
                  <div className="mb-3">
                    <label
                      htmlFor="description"
                      className="form-label fw-semibold"
                    >
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      id="description"
                      name="description"
                      rows="8"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Write your post content here (minimum 10 characters)"
                      required
                    />
                    {errors.description && (
                      <div className="invalid-feedback">
                        {errors.description}
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate("/posts")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Creating...
                        </>
                      ) : (
                        "Create Post"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
