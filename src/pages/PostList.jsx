import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/axios";

const PostList = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    title: "",
    description: "",
    sortBy: "createdAt",
    sortDirection: "DESC",
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        size: 10,
        ...(filters.title && { title: filters.title }),
        ...(filters.description && { description: filters.description }),
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
      });

      console.log("Fetching with params:", params.toString());
      const response = await api.get(`/blogs?${params}`);

      setPosts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load posts");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, filters.sortBy, filters.sortDirection, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    // fetchPosts();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSortChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(0); // Reset to first page when sorting changes
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/blogs/${id}`);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  const clearFilters = () => {
    setFilters({
      title: "",
      description: "",
      sortBy: "createdAt",
      sortDirection: "DESC",
    });
    setPage(0);
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
              <li className="nav-item"></li>
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
        {/* Search and Filter Bar */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={handleSearch}>
              <div className="row g-3">
                {/* Title Filter */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    placeholder="Filter by title..."
                  />
                </div>

                {/* Description Filter */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={filters.description}
                    onChange={handleFilterChange}
                    placeholder="Filter by description..."
                  />
                </div>

                {/* Sort By */}
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Sort By</label>
                  <select
                    className="form-select"
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="title">Title</option>
                  </select>
                </div>

                {/* Sort Direction */}
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Direction</label>
                  <select
                    className="form-select"
                    name="sortDirection"
                    value={filters.sortDirection}
                    onChange={handleSortChange}
                  >
                    <option value="DESC">Descending</option>
                    <option value="ASC">Ascending</option>
                  </select>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.title || filters.description) && (
          <div className="mb-3">
            <span className="text-muted me-2">Active filters:</span>
            {filters.title && (
              <span className="badge bg-info me-2">Title: {filters.title}</span>
            )}
            {filters.description && (
              <span className="badge bg-info me-2">
                Description: {filters.description}
              </span>
            )}
            <span className="badge bg-secondary">
              Sort: {filters.sortBy} ({filters.sortDirection})
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="text-muted">No posts found</h4>
                {(filters.title || filters.description) && (
                  <p className="text-muted">Try clearing your filters</p>
                )}
                <Link to="/posts/create" className="btn btn-primary mt-3">
                  Create First Post
                </Link>
              </div>
            ) : (
              <div className="row g-4">
                {posts.map((post) => (
                  <div key={post.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <span
                            className={`badge ${post.status ? "bg-success" : "bg-secondary"}`}
                          >
                            {post.status ? "Published" : "Draft"}
                          </span>
                          <small className="text-muted">
                            By {post.createdByName}
                          </small>
                        </div>

                        <Link
                          to={`/posts/${post.id}`}
                          className="text-decoration-none"
                        >
                          <h5 className="card-title fw-bold mb-3 text-dark hover:text-primary">
                            {post.title}
                          </h5>
                        </Link>
                        <Link
                          to={`/posts/${post.id}`}
                          className="text-decoration-none"
                        >
                          <p className="card-text text-secondary mb-4">
                            {post.description.length > 150
                              ? post.description.substring(0, 150) + "..."
                              : post.description}
                          </p>
                        </Link>

                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </small>
                          <div>
                            {post.createdBy === user?.id ? (
                              <>
                                {post.status && (
                                  <Link
                                    to={`/posts/edit/${post.id}`}
                                    className="btn btn-sm btn-outline-primary me-2"
                                  >
                                    Edit
                                  </Link>
                                )}
                                <button
                                  onClick={() => handleDelete(post.id)}
                                  disabled={!post.status}
                                  className="btn btn-sm btn-outline-danger"
                                >
                                  Delete
                                </button>
                              </>
                            ) : (
                              <span className="badge bg-secondary">
                                View Only
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 0 && (
              <nav className="mt-5">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {[...Array(totalPages)].map((_, i) => (
                    <li
                      key={i}
                      className={`page-item ${page === i ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => setPage(i)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${page === totalPages - 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostList;
