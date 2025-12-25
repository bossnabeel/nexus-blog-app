import axios from "axios";
export const api = axios.create({
  baseURL: `https://localehost:5000/api`,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

