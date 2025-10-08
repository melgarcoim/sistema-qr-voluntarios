import { Router } from 'express';
import {
  listarActividades,
  detalleActividad,
  crearActividad,
  actualizarActividad,
  eliminarActividad
} from '../controllers/actividadController.js';

const router = Router();

// 📋 GET - Listar todas las actividades
router.get('/', listarActividades);

// 🔍 GET - Obtener actividad por ID
router.get('/:id', detalleActividad);

// 🆕 POST - Crear nueva actividad
router.post('/', crearActividad);

// ✏️ PUT - Actualizar actividad existente
router.put('/:id', actualizarActividad);

// 🗑️ DELETE - Eliminar actividad
router.delete('/:id', eliminarActividad);

export default router;

