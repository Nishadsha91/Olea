// axiosInstance.js - FIXED VERSION
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Request interceptor: attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // ✅ FIXED: changed "access" to "accessToken"
    if (token) {
      console.log('Token found, adding to headers'); // Debug
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (access token expired)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not retry yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken"); // ✅ Also fix this if you have refresh token
      if (refreshToken) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

          // Save new access token with correct key
          localStorage.setItem("accessToken", res.data.access); // ✅ FIXED

          // Update original request header
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

          // Retry original request
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error("Refresh token failed", err);
          // Optional: log out user
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken"); // ✅ Fix key name
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;