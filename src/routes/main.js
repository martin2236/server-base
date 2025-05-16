const {Router} = require('express');

const { mainGet } = require('../controllers/main');

const router = Router();

router.get('/', mainGet);

module.exports = router