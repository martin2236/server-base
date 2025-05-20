const { validationResult } = require('express-validator');

const validarCampos = (req,res,next) =>{
    const errors = validationResult(req);
    if( !errors.isEmpty()){
        return res.status(400).json(errors)
    }
    next();
}

const validarAcceso = (nivelRequerido = 1) => {
    return (req, res, next) => {
        const { id } = req.params;
        const usuario = req.user;

        const niveles = {
            1: "usuario",
            2: "moderador",
            3: "administrador",
        };

        const esPropietario = usuario.id == id;

        if (usuario.rolId < nivelRequerido && !esPropietario) {
            return res.status(403).json({ success: false, msg: `Tu rol de ${niveles[usuario.rolId]} no tiene permiso para realizar esta acción` });
        }

        next();
    };
};


module.exports = {
    validarCampos,
    validarAcceso
} 