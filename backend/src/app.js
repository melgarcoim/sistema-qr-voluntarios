import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import voluntariosRoutes from './routes/voluntariosRoutes.js';
import actividadRoutes from './routes/actividadRoutes.js';
import capacitacionRoutes from './routes/capacitacionRoutes.js';
import asistenciaRoutes from './routes/asistenciaRoutes.js';
import qrcodesRoutes from './routes/qrcodeRoutes.js'; // ✅ nombre consistente
import notificacionesRoutes from './routes/notificacionesRoutes.js'; // ✅ corregido

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta principal de prueba
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 🚀');
});

// Rutas
app.use('/api/voluntarios', voluntariosRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/capacitaciones', capacitacionRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/qrcodes', qrcodesRoutes);
app.use('/api/notificaciones', notificacionesRoutes); // ✅ enlazado correctamente

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend funcionando en puerto ${PORT}`);
});



