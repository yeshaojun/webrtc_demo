import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/custom",
    },
    {
      path: "/custom",
      name: "custom",
      component: () => import("../views/custom.vue"),
    },
    {
      path: "/user",
      name: "user",
      component: () => import("../views/user.vue"),
    },
  ],
});

export default router;
