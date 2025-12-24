import { defineStore } from "pinia";
import { api } from "../services/api.js";
export const useAuthStore = defineStore("auth", {
  state: () => {
    let savedUser = null;
    try {
      const data = localStorage.getItem("user_data");
      // Check karo ke data null ya "undefined" string toh nahi
      if (data && data !== "undefined") {
        savedUser = JSON.parse(data);
      }
    } catch (e) {
      console.error("User data parse error, clearing storage");
      localStorage.removeItem("user_data");
    }

    return {
      user: savedUser,
      token: localStorage.getItem("jwt") || null,
      isLoading: false,
      error: null,
    };
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    register: async function (userData) {
      try {
        const response = await api.post("/users/register", userData);
        if (response?.data?.status === "success") {
          this.user = response.data.data.user;
          this.token = response.data.data.token;
          localStorage.setItem("jwt", response.data.data.token);
          localStorage.setItem(
            "user_data",
            JSON.stringify(response.data.data.user)
          );
        }
      } catch (error) {
        this.error = error.response?.data?.message;
      }
    },
    login: async function (userData) {
      try {
        const response = await api.post("/users/login", userData);
        if (response.data?.status === "success") {
          this.user = response.data.data.user;
          this.token = response.data.data.token;
          localStorage.setItem("jwt", response.data.data.token);
          localStorage.setItem(
            "user_data",
            JSON.stringify(response.data.data.user)
          );
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("jwt");
      localStorage.removeItem("user_data");
    },
    autoLogin: async function () {
      let _token = localStorage.getItem("jwt");
      if (!_token) return;
      this.token = _token;

      try {
        const response = await api.get("/users/me");
        const userData = response.data?.user;
        if (userData) {
          this.user = userData;
          localStorage.setItem("user_data", JSON.stringify(this.user));
          return response.data.data;
        }
      } catch (error) {
        this.logout();
        this.error = error.response?.data?.message;
      }
    },
  },
});
