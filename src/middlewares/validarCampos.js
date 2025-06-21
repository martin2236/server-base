

// src/middlewares/validarCampos.js
const { validationResult } = require('express-validator');

// Middleware para validar campos (sigue igual)
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next();
};

/**
 * Middleware para validar el acceso basado en roles y/o propiedad.
 * @param {object} options - Opciones de validación.
 * @param {number[]} [options.rolesPermitidos=[]] - Array de IDs de rol específicos que tienen acceso.
 * Si se usa, ignora 'minRol'.
 * Ej: [1, 2] permite 'usuario' y 'conductor'.
 * @param {number} [options.minRol=null] - Nivel de rol mínimo requerido. Permite ese rol y cualquier rol superior.
 * Ignorado si 'rolesPermitidos' está presente.
 * Ej: 2 permite 'conductor' y 'admin'.
 * @param {boolean} [options.allowSelf=false] - Si es true, permite el acceso si req.user.id coincide con req.params.id.
 * Útil para rutas de perfil de usuario (ej. /usuarios/:id).
 * No debe usarse para verificar propiedad de recursos (rutas, reservas).
 */
const validarAcceso = (options = {}) => {
    return (req, res, next) => {
        const {
            rolesPermitidos = [],
            minRol = null,
            allowSelf = false
        } = options;

        const usuario = req.user; // Objeto de usuario autenticado por Passport

        // 1. Verificar autenticación y existencia de rol
        if (!usuario || !usuario.rolId) {
            return res.status(401).json({ success: false, msg: 'No autenticado o rol no definido.' });
        }

        const usuarioId = usuario.id;
        const paramId = req.params.id; // El ID de los parámetros de la URL (ej. de /usuarios/:id o /rutas/:id)

        // 2. Verificar acceso propio si está permitido (ej. /usuarios/:id donde :id es el propio usuario)
        // Esto solo aplica si req.params.id representa el ID del usuario.
        if (allowSelf && usuarioId === paramId) {
            return next();
        }

        // 3. Verificar acceso basado en roles
        let tieneAccesoPorRol = false;

        if (rolesPermitidos.length > 0) {
            // Si se especifican roles permitidos, solo esos roles tienen acceso.
            // Esto cubre tu escenario de "validación estricta" de rol.
            if (rolesPermitidos.includes(usuario.rolId)) {
                tieneAccesoPorRol = true;
            }
        } else if (minRol !== null) {
            // Si se especifica un rol mínimo, ese rol y cualquier rol superior tienen acceso.
            // Esto cubre tu escenario de "roles superiores también pueden".
            if (usuario.rolId >= minRol) {
                tieneAccesoPorRol = true;
            }
        }

        if (tieneAccesoPorRol) {
            return next();
        } else {
            // Si no tiene acceso por rol y tampoco por 'allowSelf' (si applySelf era true y no era su id)
            return res.status(403).json({
                success: false,
                msg: `Acceso denegado. Tu rol de ${niveles[usuario.rolId] || 'indefinido'} no tiene permiso para realizar esta acción.`
            });
        }
    };
};

// Objeto para mapear IDs de rol a nombres (opcional, para mensajes más amigables)
const niveles = {
    1: "usuario",
    2: "moderador",
    3: "administrador",
};

module.exports = {
    validarCampos,
    validarAcceso
};