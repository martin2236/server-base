const { request, response } = require('express');
const User = require('../models/usuarios')
const jwt = require('jsonwebtoken');

const validarToken = async (req = request, res = response, next)=>{
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg:'no se envió el token'
        })
    }else{
        try {
            const {uid} = jwt.verify(token,process.env.SECRETPUBLICORPRIVATEKEY)
            //checkear que el usuario exista
            const usuario = await User.findById(uid)
            if(!usuario){
              return  res.status(401).json({
                    msg:"el token no es válido"
                })
            }
            //checkear que el estatus no sea false(usuario eliminado)
            if(!usuario.estado){
                return  res.status(401).json({
                    msg:"el token no es válido"
                })
            }
            req.usuario = usuario

            next()
        } catch (error) {
            console.log(error)
            res.status(401).json({
                msg:"el token no es válido"
            })
        }
    }
}

module.exports = {
    validarToken
}