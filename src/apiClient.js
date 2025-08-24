// src/apiClient.js

import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api", // Your Django API base URL
});

// This is an "interceptor", a function that runs before each request is sent.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
