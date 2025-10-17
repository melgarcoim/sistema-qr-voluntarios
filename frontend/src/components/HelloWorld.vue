<template>
  <div class="bg-green-500 text-white p-4 rounded">
    <h2 class="text-lg font-semibold">Hola desde HelloWorld.vue</h2>
    <p class="mt-2">Este componente está funcionando correctamente.</p>
  </div>
</template>

<script setup>
defineProps({
  msg: String
});
</script>

<style scoped>
</style>

