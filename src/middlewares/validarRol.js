
const { request, response } = require("express");
const validarRol = (req = request, res = response, next)=>{
    if(!req.usuario){
        return res.status(500).json({
            msg:"se quiere verificar el rol sin haber verificado el token"
        })
    }
    const {rol,nombre} = req.usuario;
    if(rol != "ADMIN_ROLE"){
        return res.status(401).json({
            msg:` El usuario ${nombre} no tiene los permisos para esta accion `
        })
    }
    next();
}

const tieneRol= (...roles)=>{
    return (req = request, res = response, next)=>{
        if(!req.usuario){
            return res.status(500).json({
                msg:"se quiere verificar el rol sin haber verificado el token"
            })
        }
        const {rol,nombre} = req.usuario;
        const rolValido = roles.find(item => item == rol)
        if(!rolValido){
            return res.status(401).json({
                msg:` El usuario ${nombre} no tiene los permisos para esta accion `
            })
        }
        next()
    }
}

module.exports = {
    validarRol,
    tieneRol
}