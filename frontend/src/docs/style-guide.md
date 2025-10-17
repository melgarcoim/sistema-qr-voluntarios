# 🎨 Guía de estilos del sistema de voluntarios

## 1️⃣ Paleta de colores institucional

| Nombre       | HEX       | Uso recomendado                  |
|--------------|-----------|----------------------------------|
| rojo         | #E63946   | Botones primarios, alertas      |
| amarillo     | #F1FA8C   | Énfasis, fondos secundarios     |
| gris         | #6C757D   | Texto secundario, bordes        |
| azul         | #1D3557   | Encabezados, enlaces, hover     |
| fondo        | #F8F9FA   | Fondo base de la interfaz       |

**Clases sugeridas:** `bg-rojo`, `text-azul`, `hover:bg-azul`, `bg-fondo`, `text-gris`

---

## 2️⃣ Tipografía

- Fuente principal: sistema por defecto (`sans`)
- Pesos: `font-normal`, `font-semibold`, `font-bold`
- Tamaños: `text-sm`, `text-base`, `text-xl`, `text-2xl`

---

## 3️⃣ Componentes globales iniciales

### 🔘 Botón primario

```html
<button class="bg-rojo text-white px-md py-sm rounded-md shadow-sm hover:bg-azul transition">
  Acción principal
</button>

<input class="border border-gris px-md py-sm rounded-md focus:outline-none focus:ring-2 focus:ring-azul" />

<div class="bg-fondo p-md rounded-md shadow-md">
  <h2 class="text-xl text-azul font-bold mb-sm">Título</h2>
  <p class="text-base text-gris">Contenido descriptivo.</p>
</div>

