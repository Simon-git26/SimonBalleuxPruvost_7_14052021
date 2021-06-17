//Importer express
const express = require('express');
//systeme de route de express
const router = express.Router();

//Importer le controller user
const userCtrl = require('../controllers/user');
const postCtrl = require('../controllers/post');


//Importer le middleware auth 
const auth = require('../middleware/auth');

//Impoter multer
const multer = require('../middleware/multer-config');


router.post('/register', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/user', auth, userCtrl.findUser);
router.put('/users/:id', auth, userCtrl.profilUser);
router.put('/users/:id/change-password', auth, userCtrl.changePassword);

router.post('/users/:id/publication', auth, multer, postCtrl.publish);
router.get('/publications', auth, postCtrl.findAllPosts);

module.exports = router;