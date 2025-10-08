import pool from "../config/db.js";

// Fijo: estado "asistió"
const ESTADO_ASISTIO = "516401e9-3de3-4fe3-b45d-129373847958"; // Reemplaza con el UUID real de tu tabla attendance_status

// ✅ Registrar asistencia a actividad (sin duplicados)
export const registrarAsistenciaActividad = async (
  voluntario_id,
  actividad_id,
  created_by_user_id
) => {
  // Revisar si ya existe la asistencia
  const { rows: existentes } = await pool.query(
    `SELECT id FROM participaciones
     WHERE voluntario_id = $1 AND actividad_id = $2`,
    [voluntario_id, actividad_id]
  );

  if (existentes.length > 0) {
    return { 
      message: "El voluntario ya registró asistencia en esta actividad", 
      id: existentes[0].id 
    };
  }

  // Insertar nueva asistencia
  const { rows } = await pool.query(
    `INSERT INTO participaciones 
      (voluntario_id, actividad_id, attendance_status_id, check_in_at, created_by_user_id, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), $4, NOW(), NOW())
     RETURNING id, voluntario_id, actividad_id, attendance_status_id, check_in_at`,
    [voluntario_id, actividad_id, ESTADO_ASISTIO, created_by_user_id]
  );
  return rows[0];
};

// 📋 Listar asistencia por actividad
export const getAsistenciasActividad = async (actividad_id) => {
  const { rows } = await pool.query(
    `SELECT 
      p.id, 
      v.first_name AS nombre, 
      v.last_name AS apellido, 
      s.code AS estado, 
      p.check_in_at
     FROM participaciones p
     JOIN voluntarios v ON v.id = p.voluntario_id
     LEFT JOIN attendance_status s ON s.id = p.attendance_status_id
     WHERE p.actividad_id = $1
     ORDER BY p.check_in_at`,
    [actividad_id]
  );
  return rows;
};

// ✅ Registrar asistencia a sesión de capacitación (sin duplicados)
export const registrarAsistenciaSesion = async (
  voluntario_id,
  sesion_id,
  created_by_user_id
) => {
  // Revisar si ya existe la asistencia
  const { rows: existentes } = await pool.query(
    `SELECT id FROM asistencias_capacitacion
     WHERE voluntario_id = $1 AND sesion_id = $2`,
    [voluntario_id, sesion_id]
  );

  if (existentes.length > 0) {
    return { 
      message: "El voluntario ya registró asistencia en esta sesión", 
      id: existentes[0].id 
    };
  }

  // Insertar nueva asistencia
  const { rows } = await pool.query(
    `INSERT INTO asistencias_capacitacion
      (voluntario_id, sesion_id, attendance_status_id, check_in_at, created_by_user_id, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), $4, NOW(), NOW())
     RETURNING id, voluntario_id, sesion_id, attendance_status_id, check_in_at`,
    [voluntario_id, sesion_id, ESTADO_ASISTIO, created_by_user_id]
  );
  return rows[0];
};

// 📋 Listar asistencia por sesión
export const getAsistenciasSesion = async (sesion_id) => {
  const { rows } = await pool.query(
    `SELECT 
      a.id, 
      v.first_name AS nombre, 
      v.last_name AS apellido, 
      s.code AS estado, 
      a.check_in_at
     FROM asistencias_capacitacion a
     JOIN voluntarios v ON v.id = a.voluntario_id
     LEFT JOIN attendance_status s ON s.id = a.attendance_status_id
     WHERE a.sesion_id = $1
     ORDER BY a.check_in_at`,
    [sesion_id]
  );
  return rows;
};





