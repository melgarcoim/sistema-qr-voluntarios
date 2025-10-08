import {
  getAllVoluntarios,
  createVoluntario,
  updateVoluntario,
  deleteVoluntario,
  getVoluntarioById // ✅ Importar función para obtener voluntario por ID
} from '../models/voluntariosModel.js';

import { QRCodesModel } from '../models/qrcodesModel.js'; // ✅ Importar modelo de QR
import { logAuditoria } from '../utils/auditoria.js'; // ✅ Importar función de auditoría

// 📋 GET - Listar todos los voluntarios
export const listarVoluntarios = async (req, res) => {
  try {
    const voluntarios = await getAllVoluntarios();
    res.json(voluntarios);
  } catch (error) {
    console.error('❌ Error en listarVoluntarios:', error);
    res.status(500).json({ error: 'Error al obtener voluntarios' });
  }
};

// 🆕 POST - Crear voluntario con QR automático
export const crearVoluntario = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, ciudad, state_id } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({ error: 'Nombre y apellido son requeridos' });
    }

    const nuevo = await createVoluntario(nombre, apellido, email, telefono, ciudad, state_id);
    const voluntario = nuevo;

    const qr = await QRCodesModel.create(voluntario.id);
    console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

    const token = qr.token;
    const scan_url = `${process.env.FRONTEND_URL || ''}/scan/${token}`;

    // 📝 Registrar auditoría
    await logAuditoria({
      action: 'CREATE',
      entity: 'voluntarios',
      entity_id: voluntario.id,
      user_id: 'test-user',
      after_data: voluntario
    });

    res.status(201).json({
      voluntario,
      qr,
      scan_url
    });
  } catch (error) {
    console.error('❌ Error en crearVoluntario:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un voluntario con ese valor único', details: error.detail });
    }
    res.status(500).json({ error: 'Error al crear voluntario', details: error.message });
  }
};

// ✏️ PUT - Actualizar voluntario
export const actualizarVoluntario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, ciudad, state_id } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({ error: 'Nombre y apellido son requeridos' });
    }

    const before_data = await getVoluntarioById(id);
    if (!before_data) {
      return res.status(404).json({ error: 'Voluntario no encontrado' });
    }

    const after_data = await updateVoluntario(id, nombre, apellido, email, telefono, ciudad, state_id);

    // 📝 Registrar auditoría
    await logAuditoria({
      action: 'UPDATE',
      entity: 'voluntarios',
      entity_id: id,
      user_id: 'test-user',
      before_data,
      after_data
    });

    res.json(after_data);
  } catch (error) {
    console.error('❌ Error en actualizarVoluntario:', error);
    res.status(500).json({ error: 'Error al actualizar voluntario', details: error.message });
  }
};

// 🗑️ DELETE - Eliminar voluntario
export const eliminarVoluntario = async (req, res) => {
  try {
    const { id } = req.params;

    const before_data = await getVoluntarioById(id);
    if (!before_data) {
      return res.status(404).json({ error: 'Voluntario no encontrado' });
    }

    const eliminado = await deleteVoluntario(id);

    // 📝 Registrar auditoría
    await logAuditoria({
      action: 'DELETE',
      entity: 'voluntarios',
      entity_id: id,
      user_id: 'test-user',
      before_data
    });

    res.json({ mensaje: 'Voluntario eliminado', eliminado });
  } catch (error) {
    console.error('❌ Error en eliminarVoluntario:', error);
    res.status(500).json({ error: 'Error al eliminar voluntario', details: error.message });
  }
};



