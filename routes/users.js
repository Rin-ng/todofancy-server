var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')
const auth = require('../middlewares/auth')

/* GET users listing. */
router
  .get('/exp', auth, userController.getExp)
  .get('/level', auth, userController.getLevel)
  .post('/login', userController.signIn)
  .post('/register', userController.signUp);

module.exports = router;
