import pool from '../config/db.js';

/**
 * Registra un evento en la tabla auditoria.
 * @param {string} user_id - ID del usuario/admin que hace la acción
 * @param {string} action - "create" | "update" | "delete"
 * @param {string} entity - Ej: "asistencia_actividad", "voluntario"
 * @param {string} entity_id - ID del registro afectado
 * @param {Object} before_data - Datos antes del cambio
 * @param {Object} after_data - Datos después del cambio
 */
export const logAuditoria = async ({ user_id, action, entity, entity_id, before_data = null, after_data = null }) => {
  try {
    await pool.query(
      `INSERT INTO auditoria (user_id, action, entity, entity_id, before_data, after_data)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user_id, action, entity, entity_id, before_data ? JSON.stringify(before_data) : null, after_data ? JSON.stringify(after_data) : null]
    );
    console.log(`✅ Auditoría registrada: ${action} en ${entity} (${entity_id})`);
  } catch (err) {
    console.error('❌ Error registrando auditoría:', err);
  }
};
