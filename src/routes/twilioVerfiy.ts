const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const verificationController = require('../controllers/verfiy')

router.post('/', auth, verificationController.sendCode);
router.post('/check', auth, verificationController.codeCheck);

module.exports = router;

export {};