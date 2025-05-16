const { Router } = require('express');

const { userGet,usersGet, userPut, userDelete, userProfileImage } = require('../controllers/users');

const passport = require('../helpers/passport');

const router = Router();

router.get('/:id', passport.authenticate('bearer', { session: false }), userGet);

router.get('/image/:nombre',passport.authenticate('bearer', { session: false }), userProfileImage);

router.get('/', passport.authenticate('bearer', { session: false }), usersGet);

router.put('/:id', userPut);

router.delete('/:id', userDelete);

module.exports = router;
