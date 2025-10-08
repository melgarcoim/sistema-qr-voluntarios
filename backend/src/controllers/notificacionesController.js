import pool from '../config/db.js';
import cron from 'node-cron';
import { enviarWhatsApp, validarDatosWhatsApp } from '../utils/whatsapp.js';

console.log("📢 Controlador de Notificaciones cargado correctamente.");

/**
 * 🔹 Enviar mensaje manual de prueba
 */
export const enviarWhatsAppPrueba = async (req, res) => {
  console.log("📥 POST /prueba recibido");

  try {
    const { numero, mensaje } = req.body;

    validarDatosWhatsApp(numero, mensaje);

    console.log(`📤 Enviando mensaje de prueba a ${numero}...`);

    const resultado = await enviarWhatsApp(numero, mensaje);

    const estadoCodigo = resultado.sent === 'true' ? 'ENVIADA' : 'FALLIDA';
    const { rows: estado } = await pool.query(
      'SELECT id FROM notification_status WHERE code = $1',
      [estadoCodigo]
    );

    await pool.query(
      `INSERT INTO notificaciones (type_id, status_id, payload, sent_at, created_at, updated_at)
       VALUES (
         (SELECT id FROM notification_types WHERE code = 'CONFIRMACION_ASISTENCIA'),
         $1,
         $2,
         NOW(),
         NOW(),
         NOW()
       )`,
      [estado[0].id, JSON.stringify({ numero, mensaje, respuesta: resultado })]
    );

    console.log("✅ Mensaje enviado y registrado:", resultado);

    return res.status(200).json({ ok: true, resultado });
  } catch (err) {
    console.error("❌ Error en enviarWhatsAppPrueba:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * 🔹 Enviar notificación inmediata
 */
export const enviarNotificacionInmediata = async (req, res) => {
  try {
    const { recipient_vol_id, mensaje } = req.body;

    if (!recipient_vol_id || !mensaje) {
      console.warn("⚠️ Datos incompletos en solicitud inmediata");
      return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    const { rows: voluntario } = await pool.query(
  'SELECT phone FROM voluntarios WHERE id = $1',
  [recipient_vol_id]
);

    if (!voluntario.length || !voluntario[0].phone || !voluntario[0].phone.startsWith('+591')) {
      console.warn(`⚠️ Voluntario no encontrado o sin teléfono: ${recipient_vol_id}`);
      return res.status(404).json({ error: 'Voluntario no válido.' });
    }

    const telefono = voluntario[0].phone;
    validarDatosWhatsApp(telefono, mensaje);

    const resultado = await enviarWhatsApp(telefono, mensaje);

    const estadoCodigo = resultado.sent === 'true' ? 'ENVIADA' : 'FALLIDA';
    const { rows: estado } = await pool.query(
      'SELECT id FROM notification_status WHERE code = $1',
      [estadoCodigo]
    );

    const insertQuery = `
      INSERT INTO notificaciones (type_id, status_id, recipient_vol_id, payload, scheduled_at, sent_at)
      VALUES (
        (SELECT id FROM notification_types WHERE code = 'CONFIRMACION_ASISTENCIA'),
        $1,
        $2,
        $3,
        NOW(),
        NOW()
      ) RETURNING *;
    `;
    const { rows } = await pool.query(insertQuery, [
      estado[0].id,
      recipient_vol_id,
      JSON.stringify({ numero: telefono, mensaje, respuesta: resultado })
    ]);

    console.log(`✅ Notificación enviada a ${telefono}`);

    return res.status(200).json({
      success: true,
      message: 'Notificación enviada y registrada correctamente.',
      data: rows[0],
    });
  } catch (error) {
    console.error('❌ Error al enviar notificación inmediata:', error.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * 🔹 Crear notificación programada
 */
export const crearNotificacionProgramada = async (recipient_vol_id, mensaje, fechaProgramada, tipoCodigo) => {
  try {
    const query = `
      INSERT INTO notificaciones (type_id, status_id, recipient_vol_id, payload, scheduled_at)
      VALUES (
        (SELECT id FROM notification_types WHERE code = $1),
        (SELECT id FROM notification_status WHERE code = 'PENDIENTE'),
        $2,
        $3,
        $4
      );
    `;
    await pool.query(query, [tipoCodigo, recipient_vol_id, JSON.stringify({ mensaje }), fechaProgramada]);
    console.log(`📌 Notificación programada para ${recipient_vol_id} a las ${fechaProgramada}`);
  } catch (error) {
    console.error('❌ Error creando notificación programada:', error.message);
  }
};

/**
 * 🔹 Enviar recordatorios de actividades próximas
 */
export const enviarRecordatoriosActividades = async () => {
  try {
    const { rows: actividades } = await pool.query(`
      SELECT a.id, a.nombre, a.scheduled_at, q.voluntario_id, v.telefono, v.nombre as voluntario_nombre
      FROM actividades a
      JOIN qrcodes q ON q.voluntario_id = a.responsable_voluntario_id
      JOIN voluntarios v ON v.id = q.voluntario_id
      WHERE a.scheduled_at BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
    `);

    for (const act of actividades) {
      const mensaje = `Hola ${act.voluntario_nombre}, recuerde que tiene la actividad "${act.nombre}" programada para ${new Date(act.scheduled_at).toLocaleString()}`;
      await crearNotificacionProgramada(act.voluntario_id, mensaje, act.scheduled_at, 'RECORDATORIO_2H');
    }

    console.log('✅ Recordatorios de actividades registrados');
  } catch (err) {
    console.error('❌ Error registrando recordatorios de actividades:', err.message);
  }
};

/**
 * 🔹 Enviar recordatorios de sesiones próximas
 */
export const enviarRecordatoriosSesiones = async () => {
  try {
    const { rows: sesiones } = await pool.query(`
      SELECT s.id, s.tema, s.start_at, q.voluntario_id, v.telefono, v.nombre as voluntario_nombre
      FROM sesiones_capacitacion s
      JOIN capacitaciones c ON c.id = s.capacitacion_id
      JOIN qrcodes q ON q.voluntario_id = c.responsable_voluntario_id
      JOIN voluntarios v ON v.id = q.voluntario_id
      WHERE s.start_at BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
    `);

    for (const sesion of sesiones) {
      const mensaje = `Hola ${sesion.voluntario_nombre}, recuerde que tiene la sesión "${sesion.tema}" programada para ${new Date(sesion.start_at).toLocaleString()}`;
      await crearNotificacionProgramada(sesion.voluntario_id, mensaje, sesion.start_at, 'RECORDATORIO_2H');
    }

    console.log('✅ Recordatorios de sesiones registrados');
  } catch (err) {
    console.error('❌ Error registrando recordatorios de sesiones:', err.message);
  }
};

/**
 * 🔹 Cron inteligente: revisa cada 15 minutos y envía notificaciones pendientes
 */
cron.schedule('*/15 * * * *', async () => {
  console.log('⏰ [CRON] Revisión de notificaciones pendientes...');

  try {
    const query = `
      SELECT n.id, n.recipient_vol_id, n.payload
      FROM notificaciones n
      JOIN notification_status s ON s.id = n.status_id
      WHERE s.code = 'PENDIENTE'
        AND n.scheduled_at <= NOW()
        AND n.sent_at IS NULL;
    `;
    const { rows } = await pool.query(query);

    for (const noti of rows) {
      const mensaje = noti.payload?.mensaje || 'Recordatorio';

      const { rows: vol } = await pool.query(
  'SELECT phone FROM voluntarios WHERE id = $1',
  [noti.recipient_vol_id]
);
if (vol.length && vol[0].phone && vol[0].phone.startsWith('+591')) {
        try {
          const numero = vol[0].phone;
validarDatosWhatsApp(numero, mensaje);
const resultado = await enviarWhatsApp(numero, mensaje);


          const estadoCodigo = resultado.sent === 'true' ? 'ENVIADA' : 'FALLIDA';
          await pool.query(`
            UPDATE notificaciones
            SET status_id = (SELECT id FROM notification_status WHERE code = $1),
                sent_at = NOW(),
                updated_at = NOW()
            WHERE id = $2;
          `, [estadoCodigo, noti.id]);

          console.log(`✅ Notificación enviada a voluntario ${noti.recipient_vol_id}`);
        } catch (errorEnvio) {
          console.error(`❌ Error al enviar notificación a ${noti.recipient_vol_id}:`, errorEnvio.message);
        }
      } else {
        console.warn(`⚠️ Voluntario ${noti.recipient_vol_id} no tiene teléfono registrado`);
      }
    }
  } catch (err) {
    console.error('❌ Error en el proceso CRON de notificaciones:', err.message);
}
});