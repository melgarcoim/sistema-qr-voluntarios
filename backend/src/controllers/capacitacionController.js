import {
  getAllCapacitaciones,
  getCapacitacionById,
  createCapacitacion,
  updateCapacitacion,
  deleteCapacitacion,
  createSesion,
  getSesionesByCapacitacion,
  deleteSesion
} from "../models/capacitacionModel.js";

import pool from "../config/db.js";
import { logAuditoria } from "../utils/auditoria.js"; // ✅ Auditoría integrada

// 📋 GET - Listar todas las capacitaciones
export const listarCapacitaciones = async (req, res) => {
  try {
    const capacitaciones = await getAllCapacitaciones();
    res.json(capacitaciones);
  } catch (error) {
    console.error('❌ Error en listarCapacitaciones:', error);
    res.status(500).json({ error: "Error al obtener capacitaciones" });
  }
};

// 🔍 GET - Detalle de una capacitación
export const obtenerCapacitacion = async (req, res) => {
  try {
    const { id } = req.params;
    const capacitacion = await getCapacitacionById(id);
    if (!capacitacion) return res.status(404).json({ error: "Capacitación no encontrada" });
    res.json(capacitacion);
  } catch (error) {
    console.error('❌ Error en obtenerCapacitacion:', error);
    res.status(500).json({ error: "Error al obtener capacitación" });
  }
};

// 🆕 POST - Crear nueva capacitación
export const crearNuevaCapacitacion = async (req, res) => {
  try {
    const { nombre, descripcion, created_by_user_id } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre es obligatorio" });

    const nuevaCapacitacion = await createCapacitacion(nombre, descripcion);

    await logAuditoria({
      user_id: created_by_user_id || 'system',
      action: 'CREATE',
      entity: 'capacitacion',
      entity_id: nuevaCapacitacion.id,
      before_data: null,
      after_data: nuevaCapacitacion
    });

    res.status(201).json(nuevaCapacitacion);
  } catch (error) {
    console.error('❌ Error en crearNuevaCapacitacion:', error);
    res.status(500).json({ error: "Error al crear capacitación" });
  }
};

// ✏️ PUT - Actualizar capacitación
export const actualizarCapacitacionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, updated_by_user_id } = req.body;

    const { rows } = await pool.query('SELECT * FROM capacitaciones WHERE id = $1', [id]);
    const capacitacionOriginal = rows[0];

    const capacitacionActualizada = await updateCapacitacion(id, nombre, descripcion);
    if (!capacitacionActualizada) return res.status(404).json({ error: "Capacitación no encontrada" });

    await logAuditoria({
      user_id: updated_by_user_id || 'system',
      action: 'UPDATE',
      entity: 'capacitacion',
      entity_id: id,
      before_data: capacitacionOriginal,
      after_data: capacitacionActualizada
    });

    res.json(capacitacionActualizada);
  } catch (error) {
    console.error('❌ Error en actualizarCapacitacionController:', error);
    res.status(500).json({ error: "Error al actualizar capacitación" });
  }
};

// 🗑️ DELETE - Eliminar capacitación
export const eliminarCapacitacionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { deleted_by_user_id } = req.body;

    const { rows } = await pool.query('SELECT * FROM capacitaciones WHERE id = $1', [id]);
    const capacitacionOriginal = rows[0];

    const capacitacionEliminada = await deleteCapacitacion(id);
    if (!capacitacionEliminada) return res.status(404).json({ error: "Capacitación no encontrada" });

    await logAuditoria({
      user_id: deleted_by_user_id || 'system',
      action: 'DELETE',
      entity: 'capacitacion',
      entity_id: id,
      before_data: capacitacionOriginal,
      after_data: null
    });

    res.json({ mensaje: "Capacitación eliminada", eliminado: capacitacionEliminada });
  } catch (error) {
    console.error('❌ Error en eliminarCapacitacionController:', error);
    res.status(500).json({ error: "Error al eliminar capacitación" });
  }
};

// 🆕 POST - Crear nueva sesión
export const crearNuevaSesion = async (req, res) => {
  try {
    const {
      capacitacion_id,
      tema,
      start_at,
      end_at,
      responsable_user_id,
      created_by_user_id
    } = req.body;

    if (!capacitacion_id || !tema || !start_at || !end_at) {
      return res.status(400).json({ error: "Faltan datos obligatorios para la sesión" });
    }

    const sesion = await createSesion(capacitacion_id, tema, start_at, end_at, responsable_user_id);

    await logAuditoria({
      user_id: created_by_user_id || 'system',
      action: 'CREATE',
      entity: 'sesion',
      entity_id: sesion.id,
      before_data: null,
      after_data: sesion
    });

    res.status(201).json(sesion);
  } catch (error) {
    console.error('❌ Error en crearNuevaSesion:', error);
    res.status(500).json({ error: "Error al crear sesión" });
  }
};

// 📋 GET - Listar sesiones por capacitación
export const listarSesionesPorCapacitacion = async (req, res) => {
  try {
    const { capacitacion_id } = req.params;
    const sesiones = await getSesionesByCapacitacion(capacitacion_id);
    res.json(sesiones);
  } catch (error) {
    console.error('❌ Error en listarSesionesPorCapacitacion:', error);
    res.status(500).json({ error: "Error al obtener sesiones" });
  }
};

// 🗑️ DELETE - Eliminar sesión
export const eliminarSesionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { deleted_by_user_id } = req.body;

    const { rows } = await pool.query('SELECT * FROM sesiones_capacitacion WHERE id = $1', [id]);
    const sesionOriginal = rows[0];

    if (!sesionOriginal) return res.status(404).json({ error: "Sesión no encontrada" });

    const eliminado = await deleteSesion(id);

    await logAuditoria({
      user_id: deleted_by_user_id || 'system',
      action: 'DELETE',
      entity: 'sesion',
      entity_id: id,
      before_data: sesionOriginal,
      after_data: null
    });

    res.json({ mensaje: "Sesión eliminada", eliminado });
  } catch (error) {
    console.error('❌ Error en eliminarSesionController:', error);
    res.status(500).json({ error: "Error al eliminar sesión" });
  }
};



