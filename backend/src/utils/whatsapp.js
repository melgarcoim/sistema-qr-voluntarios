import fetch from 'node-fetch';

const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
const token = process.env.ULTRAMSG_TOKEN;
const apiUrl = process.env.ULTRAMSG_API_URL;

/**
 * Valida número y mensaje antes de enviar
 * @param {string} numero
 * @param {string} mensaje
 */
export function validarDatosWhatsApp(numero, mensaje) {
  if (!numero || !mensaje) throw new Error('Número y mensaje son requeridos');

  // Asegura que el número tenga formato boliviano: +591 seguido de 8 dígitos
  const regexBolivia = /^\+591\d{8}$/;
  if (!regexBolivia.test(numero)) {
    throw new Error('Número inválido: debe tener formato +591XXXXXXXX con 8 dígitos exactos');
  }
}

/**
 * Envía un mensaje de WhatsApp usando UltraMsg
 * @param {string} numero - Número en formato internacional, ej: '+59171234567'
 * @param {string} mensaje - Contenido del mensaje
 */
export async function enviarWhatsApp(numero, mensaje) {
  try {
    validarDatosWhatsApp(numero, mensaje); // ✅ validación previa

    const url = `${apiUrl}messages/chat`;

    const body = new URLSearchParams({
      token: token,
      to: numero,
      body: mensaje,
    });

    console.log('📡 Enviando a UltraMsg:', { url, numero, mensaje });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const data = await response.json();
    console.log('✅ WhatsApp enviado:', data);
    return data;
  } catch (err) {
    console.error('❌ Error enviando WhatsApp:', err.message);
    throw err;
  }
}




