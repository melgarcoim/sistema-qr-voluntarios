import pool from '../config/db.js';

// 📥 Obtener todos los voluntarios
export const getAllVoluntarios = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        first_name AS nombre, 
        last_name AS apellido
      FROM voluntarios
      ORDER BY first_name ASC
      LIMIT 10
    `);
    return result.rows;
  } catch (error) {
    console.error('❌ Error en getAllVoluntarios:', error);
    throw error;
  }
};

// 📌 Obtener un voluntario por ID
export const getVoluntarioById = async (id) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        id, 
        first_name AS nombre, 
        last_name AS apellido
      FROM voluntarios
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );
    return result.rows[0]; // Devuelve un objeto o undefined si no existe
  } catch (error) {
    console.error('❌ Error en getVoluntarioById:', error);
    throw error;
  }
};

// ➕ Crear voluntario
export const createVoluntario = async (nombre, apellido) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO voluntarios (first_name, last_name, state_id)
      VALUES ($1, $2, $3)
      RETURNING id, first_name AS nombre, last_name AS apellido
      `,
      [
        nombre,
        apellido,
        '7ba8a40b-9f19-436d-82fd-8fa5dbc0938b' // state_id "activo"
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error en createVoluntario:', error);
    throw error;
  }
};

// 🔄 Actualizar voluntario
export const updateVoluntario = async (id, nombre, apellido) => {
  try {
    const result = await pool.query(
      `
      UPDATE voluntarios
      SET first_name = $1, last_name = $2
      WHERE id = $3
      RETURNING id, first_name AS nombre, last_name AS apellido
      `,
      [nombre, apellido, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error en updateVoluntario:', error);
    throw error;
  }
};

// 🗑️ Eliminar voluntario
export const deleteVoluntario = async (id) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM voluntarios
      WHERE id = $1
      RETURNING id, first_name AS nombre, last_name AS apellido
      `,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error en deleteVoluntario:', error);
    throw error;
  }
};


