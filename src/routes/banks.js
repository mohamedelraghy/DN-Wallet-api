const express = require('express');
const router = express.Router();

const bankController = require('../controllers/bank');

router.post('/create', bankController.createBank)

router.post('/charge', bankController.chargeBank);


module.exports = router;