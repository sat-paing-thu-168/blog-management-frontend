import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/axios";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${id}`);
      setPost(response.data);
    } catch (err) {
      setError("Failed to load post");
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/blogs/${id}`);
      navigate("/posts");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
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

  if (error || !post) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h3 className="text-danger">{error || "Post not found"}</h3>
          <Link to="/posts" className="btn btn-primary mt-3">
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = post.createdBy === user?.id;

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
              <button className="btn btn-outline-light btn-sm" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Back Button */}
            <div className="mb-3">
              <Link to="/posts" className="btn btn-outline-secondary">
                ← Back to Posts
              </Link>
            </div>

            {/* Post Detail Card */}
            <div className="card shadow">
              {/* Status Badge */}
              <div className="card-header bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    className={`badge ${post.status ? "bg-success" : "bg-secondary"} px-3 py-2`}
                  >
                    {post.status ? "Published" : "Draft"}
                  </span>
                  <small className="text-muted">
                    Posted by {post.createdByName}
                  </small>
                </div>
              </div>

              {/* Post Content */}
              <div className="card-body p-4">
                <h1 className="card-title display-6 mb-4">{post.title}</h1>

                <div className="text-muted mb-4">
                  <small>
                    <i className="bi bi-calendar me-2"></i>
                    Created: {new Date(
                      post.createdAt,
                    ).toLocaleDateString()} at{" "}
                    {new Date(post.createdAt).toLocaleTimeString()}
                  </small>
                  {post.updatedAt !== post.createdAt && (
                    <small className="ms-3">
                      <i className="bi bi-pencil me-2"></i>
                      Updated: {new Date(post.updatedAt).toLocaleDateString()}
                    </small>
                  )}
                </div>

                <hr />

                <div
                  className="post-content mt-4"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {post.description}
                </div>
              </div>

              {/* Action Buttons (only for owner) */}
              {isOwner && (
                <div className="card-footer bg-white py-3">
                  <div className="d-flex justify-content-end gap-2">
                    {post?.status && (
                      <>
                        {" "}
                        <Link
                          to={`/posts/edit/${post.id}`}
                          className="btn btn-primary"
                        >
                          Edit Post
                        </Link>
                        <button
                          onClick={handleDelete}
                          className="btn btn-danger"
                          disabled={!post?.status}
                        >
                          Delete Post
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation between posts (optional) */}
            <div className="d-flex justify-content-between mt-4">
              <Link to="/posts" className="btn btn-outline-primary">
                ← All Posts
              </Link>
              {isOwner && post?.status && (
                <Link to={`/posts/edit/${post.id}`} className="btn btn-primary">
                  Edit This Post
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
