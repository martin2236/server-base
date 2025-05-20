const {request,response} = require('express');
const { Usuario } = require('../../models');
const path = require('path');
const fs = require('fs');
const { guardarArchivo } = require('../helpers/subir-archivo');


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
    success: true,
    msg: 'get API - controlador',
    data: usuarioFront,
})
}

const userProfileImage = (req, res) => {
  const { nombre } = req.params;
  console.log(req.params);

  if (!nombre) {
    return res.status(400).json({
      success:false,
      msg: 'Falta el nombre del archivo en query param',
      data: null});
  }

  const imagePath = path.join(__dirname, '../uploads/users', nombre);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({
      success:false, 
      msg: 'Imagen no encontrada', 
      data: null});
  }

  res.sendFile(imagePath);
};

const usersGet = async (req = request, res = response)=> {
  return res.status(200).json({
    success: true,
      msg: 'get API - controlador',
      data: null
  })
  
  }
const userPut = async(req = request, res = response)=> {
  const { nombre, id,correo, } = req.body;
  const user = await Usuario.findOne({ where: { id } });
  if (!user) {
    return res.status(400).json({ 
      success: false,
      msg: 'El usuario no existe',
      data: null
    });
  }

  const file = req.file;
  let nuevaImagen = user.imagen;
  if(file){
    const nombreArchivoNuevo = await guardarArchivo(process.env.IMAGENES_DIR, "usuarios", file);
    nuevaImagen = nombreArchivoNuevo;
  }
   
  try {
    await Usuario.update({
      nombre,
      imagen: nuevaImagen
    }, {
      where: { id }
    });

    const usuarioEditado = await Usuario.findByPk(id);

    return res.status(200).json({
      success: true,
      msg: 'Usuario editado correctamente',
      data: {
        id: usuarioEditado.id,
        nombre: usuarioEditado.nombre,
        correo: usuarioEditado.correo,
        rol: usuarioEditado.rolId,
        imagen: `${process.env.HOST_API}/api/users/image/${usuarioEditado.imagen}`,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: 'Error al editar el usuario',
      data: null
    });
  }
}


const userDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Usuario.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: 'El usuario no existe',
        data: null
      });
    }
    if (user.imagen && user.imagen !== 'user.jpg'&& !user.imagen.includes('https://') && !user.imagen.includes('http://')) {
      const rutaAnterior = path.join(__dirname, '../uploads/usuarios', user.imagen);
      if (fs.existsSync(rutaAnterior)) {
        fs.unlinkSync(rutaAnterior);
      }
    }

    await Usuario.update({
      deletedAt: new Date(),
      imagen: 'user.jpg'
    }, {
      where: { id }
    });

    return res.status(200).json({
      success: true,
      msg: 'Usuario eliminado correctamente',
      data: null
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: 'Error al eliminar el usuario',
      data: null
    });
  }
};

module.exports = {
    userGet,
    userProfileImage,
    usersGet,
    userPut,
    userDelete
}