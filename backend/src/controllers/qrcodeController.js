// src/controllers/qrcodeController.js
import pool from '../config/db.js';
import { QRCodesModel } from '../models/qrcodesModel.js';

/**
 * Crea un nuevo voluntario y genera automáticamente
 * un código QR vinculado a su ID.
 */
export const crearVoluntario = async (req, res) => {
  const { first_name, last_name, email, telefono, ciudad } = req.body;

  // 🔎 Validación básica
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'Nombre y apellido son obligatorios' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 📝 Insertar voluntario
    const nuevo = await client.query(
      `INSERT INTO voluntarios (first_name, last_name, email, telefono, ciudad)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [first_name, last_name, email, telefono, ciudad]
    );

    const voluntario = nuevo.rows[0];

    // 🔐 Generar QR vinculado al voluntario recién creado
    const qr = await QRCodesModel.create(voluntario.id);

    // 🧩 Construir URL de escaneo
    const token = qr.token;
    const scan_url = `${process.env.FRONTEND_URL || ''}/scan/${token}`;

    await client.query('COMMIT');

    // 📦 Respuesta con voluntario, QR y URL de escaneo
    res.status(201).json({ voluntario, qr, scan_url });
  } catch (err) {
    await client.query('ROLLBACK');

    // 🛑 Manejo de errores de clave única
    if (err.code === '23505') {
      return res
        .status(409)
        .json({ error: 'Ya existe un voluntario con ese correo electrónico' });
    }

    console.error('❌ Error creando voluntario:', err);
    res.status(500).json({
      error: 'Error creando voluntario',
      details: err.message
    });
  } finally {
    client.release();
  }
};

/**
 * Genera un nuevo código QR para un voluntario existente.
 * Espera un parámetro :voluntario_id en la URL.
 */
export const generar = async (req, res) => {
  const { voluntario_id } = req.params;

  try {
    // Crea un nuevo QR vinculado al voluntario ya registrado
    const qr = await QRCodesModel.create(voluntario_id);

    // 🧩 Construir URL de escaneo
    const token = qr.token;
    const scan_url = `${process.env.FRONTEND_URL || ''}/scan/${token}`;

    // 📦 Respuesta con QR y URL de escaneo
    res.status(201).json({ qr, scan_url });
  } catch (err) {
    console.error('❌ Error generando QR:', err);
    res.status(500).json({
      error: 'Error generando QR',
      details: err.message
    });
  }
};

/**
 * Permite consultar un QR por su token único (para el escaneo).
 * Espera un parámetro :token en la URL.
 */
export const escanear = async (req, res) => {
  const { token } = req.params;

  try {
    const data = await QRCodesModel.findByToken(token);
    if (!data) {
      return res.status(404).json({ error: 'QR no encontrado o inválido' });
    }
    res.json(data);
  } catch (err) {
    console.error('❌ Error escaneando QR:', err);
    res.status(500).json({
      error: 'Error escaneando QR',
      details: err.message
    });
  }
};

// ✅ Export agrupado para que la ruta pueda usar QRCodesController
export const QRCodesController = {
  generar,
  escanear
};




