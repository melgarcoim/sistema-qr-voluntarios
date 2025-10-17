// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";

// 📦 Importación de vistas esenciales
import Voluntarios from "../pages/Voluntarios.vue";
import PerfilPublico from "../pages/PerfilPublico.vue";

// 📌 Definición de rutas activas
const routes = [
  {
    path: "/voluntarios",
    name: "Voluntarios",
    component: Voluntarios,
  },
  {
    path: "/perfil/:token",
    name: "PerfilPublico",
    component: PerfilPublico,
  },
  {
    path: "/",
    redirect: "/voluntarios",
  },
];

// 🚦 Instancia del router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔐 Guard global desactivado temporalmente
// router.beforeEach((to, from, next) => {
//   const token =
//     localStorage.getItem("token") || sessionStorage.getItem("token");

//   const requiresAuth = to.meta.requiresAuth || false;

//   if (requiresAuth && !token) {
//     next({ name: "Login" });
//   } else if (to.name === "Login" && token) {
//     next({ name: "Dashboard" });
//   } else {
//     next();
//   }
// });

export default router;
