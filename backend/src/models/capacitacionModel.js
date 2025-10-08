import pool from "../config/db.js";

// 📥 Obtener todas las capacitaciones
export const getAllCapacitaciones = async () => {
  const { rows } = await pool.query(
    `SELECT c.id, c.nombre, c.descripcion, COUNT(s.id) AS total_sesiones
     FROM capacitaciones c
     LEFT JOIN sesiones_capacitacion s ON s.capacitacion_id = c.id
     GROUP BY c.id
     ORDER BY c.nombre`
  );
  return rows;
};

// 📥 Obtener capacitación por ID con sus sesiones
export const getCapacitacionById = async (id) => {
  const { rows } = await pool.query(`
    SELECT c.id, c.nombre, c.descripcion,
      COALESCE(json_agg(json_build_object(
        'id', s.id,
        'tema', s.tema,
        'start_at', s.start_at,
        'end_at', s.end_at,
        'responsable_user_id', s.responsable_user_id
      )) FILTER (WHERE s.id IS NOT NULL), '[]') AS sesiones
    FROM capacitaciones c
    LEFT JOIN sesiones_capacitacion s ON c.id = s.capacitacion_id
    WHERE c.id = $1
    GROUP BY c.id
  `, [id]);
  return rows[0];
};

// ➕ Crear capacitación
export const createCapacitacion = async (nombre, descripcion) => {
  const { rows } = await pool.query(
    `INSERT INTO capacitaciones (nombre, descripcion)
     VALUES ($1, $2) RETURNING *`,
    [nombre, descripcion]
  );
  return rows[0];
};

// 🔄 Actualizar capacitación
export const updateCapacitacion = async (id, nombre, descripcion) => {
  const { rows } = await pool.query(
    `UPDATE capacitaciones
     SET nombre = $1, descripcion = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [nombre, descripcion, id]
  );
  return rows[0];
};

// 🗑️ Eliminar capacitación
export const deleteCapacitacion = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM capacitaciones WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
};

// ➕ Crear sesión de capacitación
export const createSesion = async (capacitacion_id, tema, start_at, end_at, responsable_user_id) => {
  const { rows } = await pool.query(
    `INSERT INTO sesiones_capacitacion 
     (capacitacion_id, tema, start_at, end_at, responsable_user_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [capacitacion_id, tema, start_at, end_at, responsable_user_id]
  );
  return rows[0];
};

// 📥 Listar sesiones de una capacitación
export const getSesionesByCapacitacion = async (capacitacion_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM sesiones_capacitacion 
     WHERE capacitacion_id = $1 
     ORDER BY start_at`,
    [capacitacion_id]
  );
  return rows;
};

// 🗑️ Eliminar sesión
export const deleteSesion = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM sesiones_capacitacion WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
};

