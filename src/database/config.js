const { Sequelize } = require('sequelize');
require('dotenv').config(); // Asegurate de tener esto

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT
});

const dbConnection = async () => {
  let retries = 5;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log('✅ Conexión a la base de datos establecida.');
      break;
    } catch (err) {
      console.log('❌ Error al conectar a la base de datos. Reintentando en 5s...');
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  if (!retries) {
    throw new Error('🚫 No se pudo conectar a la base de datos.');
  }
};

module.exports = {
  dbConnection,
};
