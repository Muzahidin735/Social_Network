import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

   
    if (
      originalRequest?.url?.includes("/login") ||
      originalRequest?.url?.includes("/signup") ||
      originalRequest?.url?.includes("/token")
    ) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
          return Promise.reject(error);
        }

        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh: refreshToken }
        );

        // Save new access token
        localStorage.setItem("access", res.data.access);

        // Retry original request
        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return api(originalRequest);
      } catch (err) {
        // Refresh failed → logout
        localStorage.clear();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
