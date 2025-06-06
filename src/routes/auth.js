const {Router} = require('express');
const { check } = require('express-validator');
const multerUpload = require('../helpers/multer'); 
const {validarCampos} = require('../middlewares/validarCampos');
const { esEmailUnico } = require('../middlewares/db-validators');
const passport = require('../helpers/passport');

const { login, register, validarUsuario, linkedinLogin, googleLogin } = require('../controllers/auth');

const router = Router();

router.get('/verificar/:token',validarUsuario)

router.post('/login',login);

router.post('/register', [  
    multerUpload.single('archivo'), 
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('password', 'el password debe tener mas de 6 caracteres').isLength({ min: 6 }),
    check('correo', 'el correo no es valido').isEmail(),
    check('correo').custom(esEmailUnico),
    validarCampos
],register); 

 router.get('/linkedin',passport.authenticate('linkedin', { session:false }));
  

 router.get(
        '/linkedin/callback',
        passport.authenticate('linkedin', { failureRedirect: '/login', session: false }),
        linkedinLogin
      );

 router.get('/google', passport.authenticate('google', {
        scope: ['profile', 'email']
      }));
      
 router.get(
       '/google/callback',
        passport.authenticate('google', { failureRedirect: '/login', session: false }),
        googleLogin
        );

module.exports = router