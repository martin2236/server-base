const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const guardarArchivo = (file, carpetaDestino) => {
  return new Promise((resolve, reject) => {
    const extension = file.originalname.split('.').pop().toLowerCase();
    const extensionesValidas = ['jpg', 'jpeg', 'png', 'gif'];

    if (!extensionesValidas.includes(extension)) {
      return reject(`Extensión .${extension} no permitida`);
    }

    const nombreArchivo = `${uuidv4()}.${extension}`;
    const rutaDestino = path.join(carpetaDestino, nombreArchivo);

    fs.rename(file.path, rutaDestino, (err) => {
      if (err) return reject(err);
      resolve(nombreArchivo);
    });
  });
};

module.exports = { guardarArchivo };