import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostList from "./pages/PostList";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetail from "./pages/PostDetail";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/posts"
        element={
          <PrivateRoute>
            <PostList />
          </PrivateRoute>
        }
      />
      <Route
        path="/posts/:id"
        element={
          <PrivateRoute>
            <PostDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/posts/create"
        element={
          <PrivateRoute>
            <CreatePost />
          </PrivateRoute>
        }
      />
      <Route
        path="/posts/edit/:id"
        element={
          <PrivateRoute>
            <EditPost />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/posts" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
