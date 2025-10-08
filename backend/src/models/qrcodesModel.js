import pool from "../config/db.js";
import { randomUUID } from "crypto";

export const QRCodesModel = {
  // ➕ Crear QR (si ya existe, devuelve el existente)
  async create(voluntario_id) {
    // Verificar si ya existe QR para este voluntario
    const existing = await pool.query(
      "SELECT * FROM qrcodes WHERE voluntario_id = $1",
      [voluntario_id]
    );
    if (existing.rows.length > 0) return existing.rows[0];

    const token = "QR_" + randomUUID();
    const profileUrl = `/voluntarios/${voluntario_id}`;

    const statusResult = await pool.query(
      "SELECT id FROM qrcode_status WHERE code = 'activo' LIMIT 1"
    );

    if (!statusResult.rows[0]) {
      throw new Error("❌ Estado 'activo' no encontrado en la tabla qrcode_status");
    }

    const statusId = statusResult.rows[0].id;

    const result = await pool.query(
      `INSERT INTO qrcodes (voluntario_id, token, profile_url, status_id, issued_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [voluntario_id, token, profileUrl, statusId]
    );

    return result.rows[0];
  },

  // 🔍 Buscar QR por token
  async findByToken(token) {
    const result = await pool.query(
      `SELECT q.*, v.first_name, v.last_name
       FROM qrcodes q
       JOIN voluntarios v ON q.voluntario_id = v.id
       WHERE q.token = $1`,
      [token]
    );
    return result.rows[0];
  }
};

