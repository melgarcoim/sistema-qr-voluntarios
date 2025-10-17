<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-6">Panel general</h1>

    <div v-if="loading" class="flex justify-center items-center h-40">
      <span class="loader">Cargando...</span>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CardResumen
        title="Voluntarios registrados"
        :value="resumen.voluntarios"
        link="/voluntarios"
      />
      <CardResumen
        title="Actividades activas"
        :value="resumen.actividades"
        link="/actividades"
      />
      <CardResumen
        title="Próximas capacitaciones"
        :value="resumen.capacitaciones"
        link="/capacitaciones"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CardResumen from '@/components/CardResumen.vue'
import axios from 'axios'

const router = useRouter()
const loading = ref(true)
const resumen = ref({
  voluntarios: 0,
  actividades: 0,
  capacitaciones: 0,
})

const fetchResumen = async () => {
  try {
    const [v, a, c] = await Promise.all([
      axios.get('/api/voluntarios/count'),
      axios.get('/api/actividades/upcoming'),
      axios.get('/api/capacitaciones/next'),
    ])

    resumen.value.voluntarios = v.data.total || 0
    resumen.value.actividades = a.data.length || 0
    resumen.value.capacitaciones = c.data.length || 0
  } catch (err) {
    if (err.response?.status === 401) {
      router.push('/login')
    } else {
      console.error('Error al cargar el dashboard:', err)
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchResumen)
</script>

<style scoped>
.loader {
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
