const  {Usuario, Role}  = require('../../models');

const esRolValido = async(rol = '')=>{
    const existeRol = await Role.findOne({ where: { nombre: rol } });
    if(!existeRol){
      throw new Error(`el rol ${rol} no esta registrado como válido`)
    }
}

const esEmailUnico = async(correo) =>{
  const emailYaExiste = await Usuario.findOne({ where: { correo } });
    if(emailYaExiste){
        throw new Error(`el correo ${correo}  ya encuentra registrado`)
    }
}

const esUnUsuarioRegistrado = async(id) =>{
  const user = await Usuario.findByPk(id);
  if (!user) {
    throw new Error(`El usuario no se encuentra registrado`)
  }
}

module.exports = {
    esRolValido,
    esEmailUnico,
    esUnUsuarioRegistrado
}

