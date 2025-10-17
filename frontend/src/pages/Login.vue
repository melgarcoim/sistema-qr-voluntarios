<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white p-8 rounded shadow-md">
      <h1 class="text-2xl font-bold text-center mb-6">Iniciar sesión</h1>

      <!-- Mensaje de éxito -->
      <p v-if="success" class="text-green-600 text-sm mb-4" role="alert">
        Autenticación exitosa. Redirigiendo…
      </p>

      <!-- Mensaje de error general -->
      <p v-if="error" class="text-red-600 text-sm mb-4" role="alert">{{ error }}</p>

      <!-- Mensaje de acceso denegado -->
      <p v-if="accessDenied" class="text-yellow-600 text-sm mb-4" role="alert">
        Acceso restringido para este usuario.
      </p>

      <!-- Mensaje de carga -->
      <p v-if="loading" class="text-blue-600 text-sm mb-4">Autenticando…</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Campo email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-500"
          />
          <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
        </div>

        <!-- Campo password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-500"
          />
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
        </div>

        <!-- Checkbox recordarme -->
        <div class="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            v-model="rememberMe"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="rememberMe" class="ml-2 block text-sm text-gray-700">
            Recordarme
          </label>
        </div>

        <!-- Botón de envío -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Iniciar sesión
        </button>
      </form>

      <!-- Enlace de ayuda -->
      <div class="mt-4 text-center">
        <router-link to="/recover" class="text-sm text-blue-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();

// Campos del formulario
const email = ref("");
const password = ref("");
const rememberMe = ref(false);

// Estados de UI
const loading = ref(false);
const error = ref("");
const success = ref(false);
const accessDenied = ref(false);

// Errores inline
const emailError = ref("");
const passwordError = ref("");

// Validación local antes de enviar
function validateForm() {
  emailError.value = "";
  passwordError.value = "";

  let valid = true;

  // Validar email
  if (!email.value) {
    emailError.value = "El correo es obligatorio.";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = "Formato de correo inválido.";
    valid = false;
  }

  // Validar password
  if (!password.value) {
    passwordError.value = "La contraseña es obligatoria.";
    valid = false;
  } else if (password.value.length < 6) {
    passwordError.value = "Debe tener al menos 6 caracteres.";
    valid = false;
  }

  return valid;
}

// Envío del formulario
async function handleSubmit() {
  if (!validateForm()) return;

  loading.value = true;
  error.value = "";
  success.value = false;
  accessDenied.value = false;

  try {
    const response = await api.post("/login", {
      email: email.value,
      password: password.value,
    });

    const { token, user } = response.data;

    if (!token || !user || !user.role) {
      throw new Error("Respuesta inválida del servidor.");
    }

    // Persistencia según checkbox
    const storage = rememberMe.value ? localStorage : sessionStorage;
    storage.setItem("token", token);
    storage.setItem("user", JSON.stringify(user));

    // Validar rol
    if (user.role !== "admin") {
      accessDenied.value = true;
      return;
    }

    // Mostrar éxito y redirigir
    success.value = true;
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = "Credenciales inválidas.";
    } else if (err.response?.status === 403) {
      error.value = "Acceso denegado.";
    } else {
      error.value = "Error de conexión con el servidor.";
    }
  } finally {
    loading.value = false;
  }
}
</script>



