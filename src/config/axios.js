import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          // Adjust this endpoint based on your refresh token implementation
          const response = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            {
              refreshToken,
            },
          );

          if (response.data.success && response.data.authResponseDTO) {
            const { accessToken } = response.data.authResponseDTO;
            localStorage.setItem("accessToken", accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
