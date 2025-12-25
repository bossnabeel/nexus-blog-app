import { createRouter, createWebHistory } from "vue-router";
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


export default router;
