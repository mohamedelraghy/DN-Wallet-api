const express = require('express');
const router = express.Router();

const verificationController = require('../controllers/verfiy')

router.get('/', verificationController.sendCode);
router.post('/', verificationController.codeCheck);

module.exports = router;