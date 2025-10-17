<!-- src/pages/PerfilPublico.vue -->
<template>
  <div class="p-6 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4">Perfil Público</h2>

    <div v-if="voluntario">
      <p><strong>Nombre:</strong> {{ voluntario.nombre }}</p>
      <p><strong>Apellido:</strong> {{ voluntario.apellido }}</p>
    </div>
    <div v-else>
      <p>Cargando o voluntario no encontrado...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/services/api";

const route = useRoute();
const voluntario = ref(null);

onMounted(async () => {
  try {
    const token = route.params.token;
    const res = await api.get(`/api/voluntarios/${token}`);
    voluntario.value = res.data;
  } catch (err) {
    console.error("❌ Error al cargar perfil público:", err);
  }
});
</script>
