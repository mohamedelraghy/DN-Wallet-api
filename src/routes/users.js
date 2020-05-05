
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');

const usersController = require('../controllers/users');


router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
    
});
// TypeScript
router.post('/register', usersController.register);

// router.put('/info',)

module.exports = router;