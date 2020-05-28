const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const verificationController = require('../controllers/verfiy')

router.get('/', auth, verificationController.sendCode);
router.post('/', auth, verificationController.codeCheck);

module.exports = router;