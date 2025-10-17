<template>
  <div class="bg-white shadow rounded p-4 flex flex-col justify-between h-full">
    <div>
      <h2 class="text-lg font-semibold mb-2">{{ title }}</h2>
      <p class="text-3xl font-bold text-blue-600">{{ value }}</p>
    </div>
    <router-link :to="link" class="mt-4 text-sm text-blue-500 hover:underline">
      Ver más →
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: Number,
  link: String,
})
</script>
