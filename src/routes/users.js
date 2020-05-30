const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const usersController = require('../controllers/users');


router.post('/register', usersController.register); // create new user

router.get('/me', auth, usersController.Me); // show user info

router.put('/info', auth, usersController.editUser); // edit user info

router.post('/pic', auth, usersController.profilePic); // add profile picture

module.exports = router;