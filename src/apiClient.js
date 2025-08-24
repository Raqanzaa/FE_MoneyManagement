// src/apiClient.js

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api',
});

// Request interceptor: attaches the access token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handles expired access tokens
apiClient.interceptors.response.use(
    (response) => response, // If the response is successful, just return it
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and it's not a request to the refresh endpoint
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark it as retried

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                // Make a request to our new refresh endpoint
                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                // Store the new access token
                localStorage.setItem('accessToken', newAccessToken);

                // Update the authorization header for the original request
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                // Retry the original request with the new token
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Handle refresh failure (e.g., redirect to login)
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;