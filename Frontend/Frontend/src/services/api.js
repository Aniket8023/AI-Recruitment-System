import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-recruitment-system-55kd.onrender.com/api/v1",
});

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    // FormData ke case me browser ko
    // Content-Type + boundary set karne do.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] =
        "application/json";
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

export default api;
