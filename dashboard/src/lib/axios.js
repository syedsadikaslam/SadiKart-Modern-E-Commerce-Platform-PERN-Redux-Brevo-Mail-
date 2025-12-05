import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:4000/api/v1"
      : "https://sadikart-modern-e-commerce-platform-pern.onrender.com/api/v1",
  withCredentials: true,
});
