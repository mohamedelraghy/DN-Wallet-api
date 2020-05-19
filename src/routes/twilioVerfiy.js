const express = require('express');
const router = express.Router();

const verificationController = require('../controllers/verfiy')

router.get('/', verificationController.sendCode);

module.exports = router;