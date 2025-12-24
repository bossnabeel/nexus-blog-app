import axios from "axios";
export const api = axios.create({
  baseURL: `http://192.168.1.103:5000/api`,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
