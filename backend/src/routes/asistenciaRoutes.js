import { Router } from "express";
import {
  registrarAsistenciaActividadController,
  listarAsistenciasActividadController,
  registrarAsistenciaSesionController,
  listarAsistenciasSesionController
} from "../controllers/asistenciaController.js";

const router = Router();

// Actividades
router.post("/actividad", registrarAsistenciaActividadController);
router.get("/actividad/:actividad_id", listarAsistenciasActividadController);

// Sesiones de capacitación
router.post("/sesion", registrarAsistenciaSesionController);
router.get("/sesion/:sesion_id", listarAsistenciasSesionController);

export default router;
