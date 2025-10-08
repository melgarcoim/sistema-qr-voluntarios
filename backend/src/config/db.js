import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

// Configuración del pool de conexiones
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Mostrar detalles de conexión
console.log(`📦 Conectando a PostgreSQL en ${process.env.DB_HOST}:${process.env.DB_PORT}, BD: ${process.env.DB_NAME}`);

// Probar conexión al iniciar
pool.connect()
  .then(client => {
    console.log('✅ Conexión a PostgreSQL establecida');
    client.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
  });

export default pool;

