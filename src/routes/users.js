const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const usersController = require('../controllers/users');


router.get('/me', auth, usersController.Me);
router.post('/register', usersController.register);

// router.put('/info',)

module.exports = router;