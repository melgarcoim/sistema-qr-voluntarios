import { Router } from 'express';
import {
  listarVoluntarios,
  crearVoluntario,
  actualizarVoluntario,
  eliminarVoluntario
} from '../controllers/voluntariosController.js';

const router = Router();

// 📋 GET - Listar todos los voluntarios
router.get('/', listarVoluntarios);

// 🆕 POST - Crear nuevo voluntario
router.post('/', crearVoluntario);

// ✏️ PUT - Actualizar voluntario existente
router.put('/:id', actualizarVoluntario);

// 🗑️ DELETE - Eliminar voluntario
router.delete('/:id', eliminarVoluntario);

export default router;

