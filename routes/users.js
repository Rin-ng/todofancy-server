var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')
const auth = require('../middlewares/auth')
const img = require('../middlewares/img')

/* GET users listing. */
router
  .get('/info', auth, userController.user)
  .get('/level', auth, userController.getLevel)
  .post('/login', userController.signIn)
  .post('/register', userController.signUp)
  .post('/fbLogin', userController.fbSignIn)
  .put('/update', auth, img.multer.single('file'), img.sendUploadToGCS, userController.updateProfile);

module.exports = router;
