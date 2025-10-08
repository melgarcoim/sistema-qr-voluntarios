import { Router } from "express";
import {
  listarCapacitaciones,
  obtenerCapacitacion,
  crearNuevaCapacitacion,
  actualizarCapacitacionController,
  eliminarCapacitacionController,
  crearNuevaSesion,
  listarSesionesPorCapacitacion,
  eliminarSesionController
} from "../controllers/capacitacionController.js";

const router = Router();

// CRUD capacitaciones
router.get("/", listarCapacitaciones);
router.get("/:id", obtenerCapacitacion);
router.post("/", crearNuevaCapacitacion);
router.put("/:id", actualizarCapacitacionController);
router.delete("/:id", eliminarCapacitacionController);

// CRUD sesiones
router.post("/sesiones", crearNuevaSesion);
router.get("/:capacitacion_id/sesiones", listarSesionesPorCapacitacion);
router.delete("/sesiones/:id", eliminarSesionController);

export default router;
