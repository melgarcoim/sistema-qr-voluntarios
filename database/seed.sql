-- ================================
-- SEED DATA INICIAL
-- ================================

-- 🔹 Roles de usuario
INSERT INTO roles (id, name) VALUES
    (gen_random_uuid(), 'administrador'),
    (gen_random_uuid(), 'responsable'),
    (gen_random_uuid(), 'voluntario')
ON CONFLICT DO NOTHING;

-- 🔹 Estados de voluntario
INSERT INTO volunteer_states (id, code, name) VALUES
    (gen_random_uuid(), 'activo', 'Activo'),
    (gen_random_uuid(), 'inactivo', 'Inactivo'),
    (gen_random_uuid(), 'retirado', 'Retirado')
ON CONFLICT DO NOTHING;

-- 🔹 Estados de QR
INSERT INTO qrcode_status (id, code, name) VALUES
    (gen_random_uuid(), 'activo', 'Activo'),
    (gen_random_uuid(), 'revocado', 'Revocado'),
    (gen_random_uuid(), 'expirado', 'Expirado')
ON CONFLICT DO NOTHING;

-- 🔹 Estados de asistencia
INSERT INTO attendance_status (id, code, name) VALUES
    (gen_random_uuid(), 'puntual', 'Puntual'),
    (gen_random_uuid(), 'retraso', 'Retraso'),
    (gen_random_uuid(), 'ausente', 'Ausente')
ON CONFLICT DO NOTHING;

-- 🔹 Tipos de actividad
INSERT INTO activity_types (id, code, name) VALUES
    (gen_random_uuid(), 'emergencia', 'Emergencia'),
    (gen_random_uuid(), 'capacitacion', 'Capacitación'),
    (gen_random_uuid(), 'comunitaria', 'Comunitaria')
ON CONFLICT DO NOTHING;

-- 🔹 Estados de actividad
INSERT INTO activity_status (id, code, name) VALUES
    (gen_random_uuid(), 'programada', 'Programada'),
    (gen_random_uuid(), 'en_progreso', 'En progreso'),
    (gen_random_uuid(), 'finalizada', 'Finalizada')
ON CONFLICT DO NOTHING;

-- 🔹 Tipos de notificación
INSERT INTO notification_types (id, code, name) VALUES
    (gen_random_uuid(), 'recordatorio', 'Recordatorio'),
    (gen_random_uuid(), 'urgente', 'Urgente'),
    (gen_random_uuid(), 'informativa', 'Informativa')
ON CONFLICT DO NOTHING;

-- 🔹 Estados de notificación
INSERT INTO notification_status (id, code, name) VALUES
    (gen_random_uuid(), 'pendiente', 'Pendiente'),
    (gen_random_uuid(), 'enviada', 'Enviada'),
    (gen_random_uuid(), 'fallida', 'Fallida')
ON CONFLICT DO NOTHING;

