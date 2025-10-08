import pool from "../config/db.js";
import {
  registrarAsistenciaActividad,
  getAsistenciasActividad,
  registrarAsistenciaSesion,
  getAsistenciasSesion
} from "../models/asistenciaModel.js";

import { logAuditoria } from "../utils/auditoria.js"; // ✅ Auditoría integrada

// ✅ Registrar asistencia a actividad usando token
export const registrarAsistenciaActividadController = async (req, res) => {
  try {
    const { token, actividad_id, created_by_user_id } = req.body;

    // Buscar voluntario_id desde qrcodes
    const { rows } = await pool.query(
      "SELECT voluntario_id FROM qrcodes WHERE token = $1",
      [token]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Token inválido" });
    }

    const voluntario_id = rows[0].voluntario_id;

    const asistencia = await registrarAsistenciaActividad(
      voluntario_id,
      actividad_id,
      created_by_user_id
    );

    await logAuditoria({
      user_id: created_by_user_id || 'system',
      action: 'CREATE',
      entity: 'asistencia_actividad',
      entity_id: asistencia.id,
      before_data: null,
      after_data: asistencia
    });

    res.status(201).json(asistencia);
  } catch (error) {
    console.error("❌ Error en registrarAsistenciaActividadController:", error);
    res.status(500).json({ error: "Error al registrar asistencia" });
  }
};

// 📋 Listar asistencias por actividad
export const listarAsistenciasActividadController = async (req, res) => {
  try {
    const { actividad_id } = req.params;
    const asistencias = await getAsistenciasActividad(actividad_id);
    res.json(asistencias);
  } catch (error) {
    console.error("❌ Error en listarAsistenciasActividadController:", error);
    res.status(500).json({ error: "Error al obtener asistencias" });
  }
};

// ✅ Registrar asistencia a sesión usando token
export const registrarAsistenciaSesionController = async (req, res) => {
  try {
    const { token, sesion_id, created_by_user_id } = req.body;

    // Buscar voluntario_id desde qrcodes
    const { rows } = await pool.query(
      "SELECT voluntario_id FROM qrcodes WHERE token = $1",
      [token]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Token inválido" });
    }

    const voluntario_id = rows[0].voluntario_id;

    const asistencia = await registrarAsistenciaSesion(
      voluntario_id,
      sesion_id,
      created_by_user_id
    );

    await logAuditoria({
      user_id: created_by_user_id || 'system',
      action: 'CREATE',
      entity: 'asistencia_sesion',
      entity_id: asistencia.id,
      before_data: null,
      after_data: asistencia
    });

    res.status(201).json(asistencia);
  } catch (error) {
    console.error("❌ Error en registrarAsistenciaSesionController:", error);
    res.status(500).json({ error: "Error al registrar asistencia en sesión" });
  }
};

// 📋 Listar asistencias por sesión
export const listarAsistenciasSesionController = async (req, res) => {
  try {
    const { sesion_id } = req.params;
    const asistencias = await getAsistenciasSesion(sesion_id);
    res.json(asistencias);
  } catch (error) {
    console.error("❌ Error en listarAsistenciasSesionController:", error);
    res.status(500).json({ error: "Error al obtener asistencias de sesión" });
  }
};



