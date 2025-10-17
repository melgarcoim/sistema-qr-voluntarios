import pool from '../config/db.js';

// 📥 Obtener todos los voluntarios
export const getAllVoluntarios = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        ci,
        first_name,
        last_name,
        email,
        phone,
        photo_url,
        year_joined,
        state_id,
        emergency_contact_name,
        emergency_contact_phone,
        created_at,
        updated_at
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
        ci,
        first_name,
        last_name,
        email,
        phone,
        photo_url,
        year_joined,
        state_id,
        emergency_contact_name,
        emergency_contact_phone,
        created_at,
        updated_at
      FROM voluntarios
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error en getVoluntarioById:', error);
    throw error;
  }
};

// ➕ Crear voluntario
export const createVoluntario = async (
  ci,
  first_name,
  last_name,
  email,
  phone,
  photo_url,
  year_joined,
  state_id,
  emergency_contact_name,
  emergency_contact_phone
) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO voluntarios (
        ci,
        first_name,
        last_name,
        email,
        phone,
        photo_url,
        year_joined,
        state_id,
        emergency_contact_name,
        emergency_contact_phone
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        ci,
        first_name,
        last_name,
        email,
        phone,
        photo_url,
        year_joined,
        state_id,
        emergency_contact_name,
        emergency_contact_phone
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error en createVoluntario:', error);
    throw error;
  }
};

// 🔄 Actualizar voluntario
export const updateVoluntario = async (
  id,
  ci,
  first_name,
  last_name,
  email,
  phone,
  photo_url,
  year_joined,
  state_id,
  emergency_contact_name,
  emergency_contact_phone
) => {
  try {
    const result = await pool.query(
      `
      UPDATE voluntarios
      SET
        ci = $1,
        first_name = $2,
        last_name = $3,
        email = $4,
        phone = $5,
        photo_url = $6,
        year_joined = $7,
        state_id = $8,
        emergency_contact_name = $9,
        emergency_contact_phone = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
      `,
      [
        ci,
        first_name,
        last_name,
        email,
        phone,
        photo_url,
        year_joined,
        state_id,
        emergency_contact_name,
        emergency_contact_phone,
        id
      ]
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
      RETURNING *
      `,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error en deleteVoluntario:', error);
    throw error;
  }
};



