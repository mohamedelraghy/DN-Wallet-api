const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const usersController = require('../controllers/users');


router.post('/register', usersController.register);

router.get('/me', auth, usersController.Me);

router.put('/info', auth, usersController.editUser);

router.post('/pic', auth, usersController.profilePic);

module.exports = router;