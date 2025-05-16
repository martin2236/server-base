const {request,response} = require('express');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../../models');
const path = require('path');
const fs = require('fs');


require('dotenv').config();

const userGet = async (req = request, res = response)=> {
  console.log("req.params", req.params);
  const { id } = req.params;
  const { nombre, correo } = req.query;

  const usuario = await Usuario.findOne({ where: { id } });
  if (!usuario) {
    return res.status(404).json({
      msg: 'Usuario no encontrado',
    });
  }
  
const image = `${process.env.HOST_API}/${usuario.imagen}`;
const usuarioFront = {
  id: usuario.id,
  nombre: usuario.nombre,
  correo: usuario.correo,
  imagen: image,
}
return res.status(200).json({
    msg: 'get API - controlador',
    data: usuarioFront,
})
}

const userProfileImage = (req, res) => {
  const { nombre } = req.params;
  console.log(req.params);

  if (!nombre) {
    return res.status(400).json({ msg: 'Falta el nombre del archivo en query param' });
  }

  const imagePath = path.join(__dirname, '../uploads/users', nombre);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ msg: 'Imagen no encontrada' });
  }

  res.sendFile(imagePath);
};

const usersGet = async (req = request, res = response)=> {
  return res.status(200).json({
      msg: 'get API - controlador',
  })
  
  }
const userPut = async(req = request, res = response)=> {
    let {id}= req.params;
    const {_id,password, google, correo, ...datosAModificar} = req.body

  }

const userDelete = async (req, res)=> {
    const authUser = req.usuario
  }

module.exports = {
    userGet,
    userProfileImage,
    usersGet,
    userPut,
    userDelete
}