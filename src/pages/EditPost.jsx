import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/axios";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      setFormData({
        title: response.data.title,
        description: response.data.description,
      });

      // Check if current user is the owner
      if (response.data.createdBy === user?.id) {
        setIsOwner(true);
      } else {
        setGeneralError("You do not have permission to edit this post");
      }
    } catch (err) {
      setGeneralError(err.response?.data?.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOwner) {
      setGeneralError("You cannot edit this post");
      return;
    }

    setErrors({});
    setGeneralError("");
    setSaving(true);

    try {
      await api.put(`/blogs/${id}`, formData);
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
      // Case 2: Duplicate title error (status 400 with message only)
      else if (errorData?.message) {
        // Check if it's a duplicate title error
        if (errorData.message.toLowerCase().includes("already exists")) {
          setErrors({ title: errorData.message });
        } else {
          setGeneralError(errorData.message);
        }
      }
      // Case 3: Any other error
      else {
        setGeneralError("Failed to update post. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
                <Link className="nav-link" to="/posts/create">
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
                <h4 className="mb-0">Edit Post</h4>
              </div>

              <div className="card-body">
                {/* Back Button */}
                <div className="mb-3">
                  <Link
                    to="/posts"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    ← Back to Posts
                  </Link>
                </div>

                {/* General Error Message */}
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

                {!isOwner ? (
                  <div className="text-center py-4">
                    <p className="text-muted mb-3">
                      You don't have permission to edit this post.
                    </p>
                    <button
                      onClick={() => navigate("/posts")}
                      className="btn btn-primary"
                    >
                      Back to Posts
                    </button>
                  </div>
                ) : (
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
                      {!errors.title && (
                        <small className="text-muted">
                          Title must be between 3 and 200 characters
                        </small>
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
                      {!errors.description && (
                        <small className="text-muted">
                          Description must be at least 10 characters
                        </small>
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
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
