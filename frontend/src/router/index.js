import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import CreatePost from "../pages/CreatePost.vue";
import PostDetail from "../pages/PostDetail.vue";
import Profile from "../pages/Profile.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/login",
      component: Login,
      meta: { guestOnly: true },
    },
    {
      path: "/register",
      component: Register,
      meta: { guestOnly: true },
    },
    {
      path: "/create-post",
      component: CreatePost,
      meta: { requiresAuth: true },
    },
    {
      path: "/posts/:postId",
      component: PostDetail,
    },
    {
      path: "/profile",
      component: Profile,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (localStorage.getItem("jwt") && !authStore.user) {
    await authStore.autoLogin();
  }

  const loggedIn = authStore.isAuthenticated;
  console.log("Navigating to:", to.path, "| Is Authenticated:", loggedIn);
  if (to.meta.requiresAuth && !loggedIn) {
    return next({ path: "/login", replace: true });
  }
  if (to.meta.guestOnly && loggedIn) {
    return next({ path: "/", replace: true });
  }

  next();
});

export default router;
