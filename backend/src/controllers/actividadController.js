import {
  getAllActividades,
  getActividadById,
  createActividad,
  updateActividad,
  deleteActividad
} from '../models/actividadModel.js';

import pool from '../config/db.js';
import { logAuditoria } from '../utils/auditoria.js'; // ✅ Importar función de auditoría

// 📋 GET - Listar todas las actividades
export const listarActividades = async (req, res) => {
  try {
    const actividades = await getAllActividades();
    res.json(actividades);
  } catch (error) {
    console.error('❌ Error en listarActividades:', error);
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
};

// 🔍 GET - Detalle de una actividad por ID
export const detalleActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const actividad = await getActividadById(id);
    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }
    res.json(actividad);
  } catch (error) {
    console.error('❌ Error en detalleActividad:', error);
    res.status(500).json({ error: 'Error al obtener actividad' });
  }
};

// 🆕 POST - Crear nueva actividad
export const crearActividad = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      type_id,
      status_id,
      scheduled_at,
      start_at,
      end_at,
      responsable_user_id,
      responsable_voluntario_id,
      created_by_user_id
    } = req.body;

    if (!nombre || !type_id || !status_id || !scheduled_at || !start_at || !end_at) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const nuevaActividad = await createActividad({
      nombre,
      descripcion,
      type_id,
      status_id,
      scheduled_at,
      start_at,
      end_at,
      responsable_user_id,
      responsable_voluntario_id
    });

    await logAuditoria({
      user_id: created_by_user_id || 'test-user',
      action: 'CREATE',
      entity: 'actividades',
      entity_id: nuevaActividad.id,
      before_data: null,
      after_data: nuevaActividad
    });

    res.status(201).json(nuevaActividad);
  } catch (error) {
    console.error('❌ Error en crearActividad:', error);
    res.status(500).json({ error: 'Error al crear actividad' });
  }
};

// ✏️ PUT - Actualizar actividad existente
export const actualizarActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      type_id,
      status_id,
      scheduled_at,
      start_at,
      end_at,
      responsable_user_id,
      responsable_voluntario_id,
      updated_by_user_id
    } = req.body;

    const { rows } = await pool.query(
      'SELECT * FROM actividades WHERE id = $1',
      [id]
    );
    const actividadOriginal = rows[0];

    const actividadActualizada = await updateActividad(id, {
      nombre,
      descripcion,
      type_id,
      status_id,
      scheduled_at,
      start_at,
      end_at,
      responsable_user_id,
      responsable_voluntario_id
    });

    if (!actividadActualizada) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    await logAuditoria({
      user_id: updated_by_user_id || 'test-user',
      action: 'UPDATE',
      entity: 'actividades',
      entity_id: id,
      before_data: actividadOriginal,
      after_data: actividadActualizada
    });

    res.json(actividadActualizada);
  } catch (error) {
    console.error('❌ Error en actualizarActividad:', error);
    res.status(500).json({ error: 'Error al actualizar actividad' });
  }
};

// 🗑️ DELETE - Eliminar actividad
export const eliminarActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const { deleted_by_user_id } = req.body;

    const { rows } = await pool.query(
      'SELECT * FROM actividades WHERE id = $1',
      [id]
    );
    const actividadOriginal = rows[0];

    const actividadEliminada = await deleteActividad(id);

    if (!actividadEliminada) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    await logAuditoria({
      user_id: deleted_by_user_id || 'test-user',
      action: 'DELETE',
      entity: 'actividades',
      entity_id: id,
      before_data: actividadOriginal,
      after_data: null
    });

    res.json({ mensaje: 'Actividad eliminada', actividadEliminada });
  } catch (error) {
    console.error('❌ Error en eliminarActividad:', error);
    res.status(500).json({ error: 'Error al eliminar actividad' });
  }
};



