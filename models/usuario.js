'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.belongsTo(models.Role, {
        foreignKey: 'rolId',
        as: 'rol'
      });
    }
  }
  Usuario.init({
    nombre: DataTypes.STRING,
    correo: DataTypes.STRING,
    password: DataTypes.STRING,
    imagen: DataTypes.STRING,
    verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        defaultValue: 1,
        model: 'Roles',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};