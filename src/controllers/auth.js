const {request,response} = require('express');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Usuario, Role } = require('../../models');
const {guardarArchivo} = require('../helpers/subir-archivo');
const { enviarEmailVerificacion } = require('../helpers/enviarEmail');

const login = async (req = request, res = response) => {
  
  try {
    const { correo, password } = req.body;
    const user = await Usuario.findOne({ where: { correo } });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: 'Usuario o contraseña incorrectos',
        data: null
      });
    }

    if (!user.verificado) {
      return res.status(403).json({
        success: false,
        msg: 'Por favor verifica tu cuenta antes de iniciar sesión',
        data: null
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        msg: 'Usuario o contraseña incorrectos',
        data: null
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      msg: 'Login exitoso',
      data: {
        nombre: user.nombre,
        correo: user.correo,
        imagen: user.imagen,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false,
      msg: 'Error en el servidor',
      data: null
    });
  }
};


const register = async (req = request, res = response) => {
  try {
    const { nombre, correo, password } = req.body;

    const user = await Usuario.findOne({ where: { correo } });
    if (user) {
      return res.status(400).json({ 
        success: false,
        msg: 'El usuario ya existe',
        data: null
      });
    }

    const file = req.file;
    let nombreArchivo = file
      ? await guardarArchivo(file, process.env.IMAGENES_DIR)
      : 'user.jpg';

    const salt = bcrypt.genSaltSync(10);
    const defaulRol = 1;

    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      password: bcrypt.hashSync(password, salt),
      imagen: nombreArchivo,
      rolId: defaulRol,
    });

    const token = jwt.sign(
      { id: nuevoUsuario.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const link = `${process.env.HOST_API}/api/auth/verificar/${token}`;

    await enviarEmailVerificacion(nuevoUsuario.correo, nuevoUsuario.nombre, link);

    const rol = await Role.findOne({ where: { id: defaulRol } }); // ✅ corregido
    if (!rol) {
      return res.status(400).json({
        success: false,
        msg: 'El rol del usuario no existe',
        data: null
      });
    }

    const userFront = {
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
      imagen: nuevoUsuario.imagen,
      rol:rol.nombre,
      token,
    };

    return res.status(201).json({ 
      success: true,
      msg: 'Usuario creado con éxito verifique su correo', 
      usuario: userFront });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false,
      msg: 'Error al crear el usuario',
      data: null
     });
  }
};

const validarUsuario = async (req = request, res = response) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(404).json({
         success:false,
         msg: 'Usuario no encontrado',
         data:null
        });
    }

    if (usuario.verificado) {
      return res.status(400).json({ 
        success: false,
        msg: 'El usuario ya fue verificado',
        data: null
      });
    }

    usuario.verificado = true;
    await usuario.save();

    return res.status(200).json({ 
      success: true,
      msg: 'Usuario verificado con éxito',
      data: null, 
    });

  } catch (err) {
    return res.status(400).json({ 
      success: false,
      msg: 'Token inválido o expirado' ,
      data: null
    });
  }
};

const linkedinLogin = async (req, res) => {
  const token = generarJWT(req.user.id, req.user.correo);
  res.redirect(`${process.env.HOST_API}/api/auth/callback?token=${token}`);
};

const googleLogin = async (req, res) => {
  const token = generarJWT(req.user.id, req.user.correo);
  res.redirect(`${process.env.HOST_API}/api/auth/callback?token=${token}`);
};

module.exports = {
    login,
    register,
    validarUsuario,
    linkedinLogin,
    googleLogin
}