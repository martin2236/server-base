const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const guardarArchivo = (carpetaDestino, subCarpeta ,archivoNuevo, archivoAnterior  ) => {
  return new Promise((resolve, reject) => {
    const extension = archivoNuevo.originalname.split('.').pop().toLowerCase();
    const extensionesValidas = ['jpg', 'jpeg', 'png', 'gif'];

    if (!extensionesValidas.includes(extension)) {
      return reject(`Extensión .${extension} no permitida`);
    }

    if(archivoAnterior && !archivoAnterior.includes('https://') && !archivoAnterior.includes('http://')){
      const rutaAnterior = path.join(carpetaDestino, subCarpeta, archivoAnterior);
      if (fs.existsSync(rutaAnterior)) {
        fs.unlinkSync(rutaAnterior);
      }
    }
    const file = archivoNuevo;
    const nombreArchivo = `${uuidv4()}.${extension}`;
    const rutaDestino = path.join(carpetaDestino, subCarpeta, nombreArchivo);

    fs.mkdirSync(path.join(carpetaDestino, subCarpeta), { recursive: true });

    fs.rename(file.path, rutaDestino, (err) => {
      if (err) return reject(err);
      resolve(nombreArchivo);
    });
  });
};

module.exports = { guardarArchivo };