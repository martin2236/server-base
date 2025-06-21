const { Router } = require('express');
const {validarCampos,validarAcceso} = require('../middlewares/validarCampos');
const multerUpload = require('../helpers/multer'); 
const { check } = require('express-validator');
const { esUnUsuarioRegistrado } = require('../middlewares/db-validators');
const { userGet,usersGet, userPut, userDelete, userProfileImage } = require('../controllers/users');
const passport = require('../helpers/passport');


const router = Router();

router.get('/:id', passport.authenticate('bearer', { session: false }), userGet);

router.get('/image/:nombre',passport.authenticate('bearer', { session: false }), userProfileImage);

router.get('/', [
    passport.authenticate('bearer', { session: false }),
    validarAcceso({rolesPermitidos:[2,3]})
], usersGet);

router.put('/editar',[ 
    passport.authenticate('bearer', { session: false }),
    multerUpload.single('archivo'), 
    check('id').custom(esUnUsuarioRegistrado),
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('correo', 'el correo no es valido').isEmail(),
    validarCampos,
    validarAcceso({minRol:3})
], userPut);

router.delete('/delete/:id', [
    passport.authenticate('bearer', { session: false }),
    validarAcceso({minRol:3})
], userDelete);

module.exports = router;
