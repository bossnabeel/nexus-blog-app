import axios from "axios";
export const api = axios.create({
  baseURL: `https://nexus-blog-3uy2u0e3v-bossnabeels-projects.vercel.app/api`,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
