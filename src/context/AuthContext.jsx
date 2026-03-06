import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../config/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (accessToken && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Login attempt for:", email);
      const response = await api.post("/auth/login", { email, password });
      console.log("Login response:", response.data);

      if (response.data.success && response.data.authResponseDTO) {
        const { accessToken, refreshToken, user } =
          response.data.authResponseDTO;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);

        return { success: true, user };
      } else {
        return {
          success: false,
          error: response.data.error || "Login failed",
        };
      }
    } catch (err) {
      console.error("Login error:", err.response?.data);

      // Handle validation error format (400 with errors object)
      if (err.response?.status === 400 && err.response?.data) {
        // Return the entire error object from backend
        return {
          success: false,
          error: err.response.data,
        };
      }

      // Handle 401 Unauthorized (invalid credentials)
      if (err.response?.status === 401) {
        return {
          success: false,
          error: err.response?.data?.message || "Invalid username or password",
        };
      }

      // Handle other errors
      return {
        success: false,
        error: {
          message:
            err.response?.data?.message || "Login failed. Please try again.",
        },
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log("Register attempt:", userData);
      const response = await api.post("/auth/register", userData);
      console.log("Register response:", response.data);

      if (response.data.success && response.data.authResponseDTO) {
        const { accessToken, refreshToken, user } =
          response.data.authResponseDTO;

        // Store in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Update state
        setUser(user);
        console.log("User state updated:", user);

        return { success: true, user };
      } else {
        return {
          success: false,
          error: response.data.error || "Registration failed",
        };
      }
    } catch (err) {
      console.error("Register error:", err.response?.data);

      // Handle validation error format
      if (err.response?.status === 400 && err.response?.data) {
        return {
          success: false,
          error: err.response.data,
        };
      }

      return {
        success: false,
        error: {
          message: err.response?.data?.message || "Registration failed",
        },
      };
    }
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
