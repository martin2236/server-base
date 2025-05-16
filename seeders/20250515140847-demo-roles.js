'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      { nombre: 'usuario', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'moderador', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'admin', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
