// src/routes/qrcodeRoutes.js
import express from "express";
import { crearVoluntario, QRCodesController } from "../controllers/qrcodeController.js";

const router = express.Router();

// Crear un voluntario y generar QR automáticamente
router.post("/voluntarios", crearVoluntario);

// 🆕 Generar QR para un voluntario existente
router.post("/:voluntario_id", QRCodesController.generar);

// 📲 Escanear QR por token
router.get("/scan/:token", QRCodesController.escanear);

export default router;
