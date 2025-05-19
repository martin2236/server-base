'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.Usuario, {
        foreignKey: 'rolId',
        as: 'usuarios'
      });
    }
  }

  Role.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    
  }, {
    sequelize,
    modelName: 'Role',
    paranoid: true,
  });

  return Role;
};