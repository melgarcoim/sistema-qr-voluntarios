import { Router } from 'express';
import {
  enviarWhatsAppPrueba,
  enviarNotificacionInmediata,
} from '../controllers/notificacionesController.js';

const router = Router();

// 📱 Prueba manual de envío
router.post('/prueba', enviarWhatsAppPrueba);

// ⚡ Envío inmediato de notificación
router.post('/enviar-inmediata', enviarNotificacionInmediata);

export default router;
