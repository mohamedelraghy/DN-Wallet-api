const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/pay');

router.get('/balance', paymentController.balance);

router.post('/charge', paymentController.charge);

module.exports = router;