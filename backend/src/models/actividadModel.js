import pool from "../config/db.js";

// 📥 Obtener todas las actividades
export const getAllActividades = async () => {
  const { rows } = await pool.query(
    `SELECT 
      a.id, a.nombre, a.descripcion, a.type_id, a.status_id,
      a.scheduled_at, a.start_at, a.end_at,
      a.responsable_user_id, a.responsable_voluntario_id,
      COALESCE(u.full_name, 'Sin responsable') AS responsable_usuario,
      COALESCE(v.first_name || ' ' || v.last_name, 'Sin voluntario') AS responsable_voluntario
     FROM actividades a
     LEFT JOIN usuarios u ON a.responsable_user_id = u.id
     LEFT JOIN voluntarios v ON a.responsable_voluntario_id = v.id
     ORDER BY a.scheduled_at ASC
     LIMIT 20`
  );
  return rows;
};

// 📥 Obtener actividad por ID
export const getActividadById = async (id) => {
  const { rows } = await pool.query(
    `SELECT 
      a.id, a.nombre, a.descripcion, a.type_id, a.status_id,
      a.scheduled_at, a.start_at, a.end_at,
      a.responsable_user_id, a.responsable_voluntario_id,
      COALESCE(u.full_name, 'Sin responsable') AS responsable_usuario,
      COALESCE(v.first_name || ' ' || v.last_name, 'Sin voluntario') AS responsable_voluntario
     FROM actividades a
     LEFT JOIN usuarios u ON a.responsable_user_id = u.id
     LEFT JOIN voluntarios v ON a.responsable_voluntario_id = v.id
     WHERE a.id = $1`,
    [id]
  );
  return rows[0];
};

// ➕ Crear actividad
export const createActividad = async ({
  nombre,
  descripcion,
  type_id,
  status_id,
  scheduled_at,
  start_at,
  end_at,
  responsable_user_id,
  responsable_voluntario_id
}) => {
  const { rows } = await pool.query(
    `INSERT INTO actividades 
     (nombre, descripcion, type_id, status_id, scheduled_at, start_at, end_at, responsable_user_id, responsable_voluntario_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [nombre, descripcion, type_id, status_id, scheduled_at, start_at, end_at, responsable_user_id, responsable_voluntario_id]
  );
  return rows[0];
};

// 🔄 Actualizar actividad
export const updateActividad = async (id, {
  nombre,
  descripcion,
  type_id,
  status_id,
  scheduled_at,
  start_at,
  end_at,
  responsable_user_id,
  responsable_voluntario_id
}) => {
  const { rows } = await pool.query(
    `UPDATE actividades
     SET nombre = $1, descripcion = $2, type_id = $3, status_id = $4,
         scheduled_at = $5, start_at = $6, end_at = $7,
         responsable_user_id = $8, responsable_voluntario_id = $9,
         updated_at = NOW()
     WHERE id = $10
     RETURNING *`,
    [nombre, descripcion, type_id, status_id, scheduled_at, start_at, end_at, responsable_user_id, responsable_voluntario_id, id]
  );
  return rows[0];
};

// 🗑️ Eliminar actividad
export const deleteActividad = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM actividades WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
};


