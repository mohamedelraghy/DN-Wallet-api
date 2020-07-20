const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const paymentController = require('../controllers/pay');

router.get('/balance', auth, paymentController.balance);

router.post('/charge', auth, paymentController.charge);

router.post('/card', auth, paymentController.card);

module.exports = router;