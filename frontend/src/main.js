import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // ✅ Importar el router
import "./style.css";
import "./styles/tailwind.css";

createApp(App).use(router).mount("#app"); // ✅ Montar el router
