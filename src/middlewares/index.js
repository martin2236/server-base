
const  validaCampos = require('../middlewares/validarCampos');
const validaToken = require('../middlewares/validarToken');
const validaRoles = require('../middlewares/validarRol');

module.exports={
    ...validaCampos,
    ...validaToken,
    ...validaRoles
}