import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // 🔹 carga las variables del .env

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Servidor backend funcionando 🚀 en puerto ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

