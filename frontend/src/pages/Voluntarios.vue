<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-blue-700">Registrar Voluntario</h2>

    <form @submit.prevent="crearVoluntario" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="form.ci" placeholder="CI" class="w-full p-2 border rounded" />
      <input v-model="form.first_name" placeholder="Nombre" class="w-full p-2 border rounded" required />
      <input v-model="form.last_name" placeholder="Apellido" class="w-full p-2 border rounded" required />
      <input v-model="form.email" type="email" placeholder="Correo electrónico" class="w-full p-2 border rounded" />
      <input v-model="form.phone" type="tel" placeholder="Teléfono" class="w-full p-2 border rounded" />

      <!-- 📷 Carga de imagen -->
      <input type="file" @change="handleFileUpload" accept="image/*" class="w-full p-2 border rounded md:col-span-2" />
      <div v-if="form.photo_url" class="md:col-span-2 text-center">
        <img :src="form.photo_url" alt="Foto subida" class="w-32 h-32 mx-auto rounded-full border mt-2" />
      </div>

      <input v-model.number="form.year_joined" type="number" placeholder="Año de ingreso" class="w-full p-2 border rounded" />
      <input v-model="form.emergency_contact_name" placeholder="Contacto de emergencia" class="w-full p-2 border rounded" />
      <input v-model="form.emergency_contact_phone" type="tel" placeholder="Teléfono de emergencia" class="w-full p-2 border rounded" />

      <!-- Campo oculto para estado activo -->
      <input v-model="form.state_id" type="hidden" />

      <div class="md:col-span-2">
        <button type="submit" class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Registrar
        </button>
      </div>
    </form>

    <div v-if="qrUrl" class="mt-8 text-center">
      <h3 class="font-semibold mb-2">QR generado:</h3>
      <img :src="qrUrl" alt="QR del voluntario" class="w-40 h-40 mx-auto border" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import api from "@/services/api";
import { supabase } from "@/services/supabase";

const form = ref({
  ci: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  photo_url: "",
  year_joined: null,
  emergency_contact_name: "",
  emergency_contact_phone: "",
  state_id: "7ba8a40b-9f19-436d-82fd-8fa5dbc0938b"
});

const qrUrl = ref("");

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validación de tipo y tamaño
  if (!file.type.startsWith("image/")) {
    console.error("❌ El archivo no es una imagen válida.");
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    console.error("❌ La imagen supera los 2MB.");
    return;
  }

  const fileName = `${uuidv4()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("voluntarios")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (error) {
    console.error("❌ Error al subir imagen:", error.message);
    return;
  }

  const { publicUrl } = supabase.storage
    .from("voluntarios")
    .getPublicUrl(fileName);

  form.value.photo_url = publicUrl;
}

async function crearVoluntario() {
  try {
    const res = await api.post("/api/voluntarios", form.value);
    const id = res.data.voluntario.id;
    qrUrl.value = `${import.meta.env.VITE_API_URL}/api/qrcodes/${id}`;
  } catch (err) {
    console.error("❌ Error al crear voluntario:", err.message);
  }
}
</script>





