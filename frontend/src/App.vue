<script setup>
import { onMounted } from 'vue'
import { pingBackend } from './api'

onMounted(() => {
  pingBackend()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Encabezado institucional -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-blue-700">Sistema QR Voluntarios</h1>
      <nav class="mt-4 flex gap-4 text-blue-600 font-semibold">
        <RouterLink :to="{ name: 'Voluntarios' }">Voluntarios</RouterLink>
        <RouterLink :to="{ name: 'PerfilPublico', params: { token: 'demo' } }">Perfil Público</RouterLink>
      </nav>
    </header>

    <!-- Renderizado dinámico de vistas -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
nav a.router-link-exact-active {
  text-decoration: underline;
}
</style>

