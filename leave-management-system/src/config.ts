export const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://leave-management-system-21sz.onrender.com/api"
    : "/api";