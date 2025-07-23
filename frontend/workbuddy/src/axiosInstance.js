// src/api/axiosInstance.js
import axios from "axios";
import {API_URL} from "./constants/constant.js";


const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🟢 Needed for cookie-based tokens
});

// Intercept 401 errors (access token expired)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        return axiosInstance(originalRequest); // retry with new token
      } catch (err) {
        console.error("🔴 Refresh token expired or invalid. Redirecting to login.",err.message);
     // Redirect only if refresh fails
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
