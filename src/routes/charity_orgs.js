const express = require('express');
const router = express.Router();


const charityController = require('../controllers/charity')

router.get('/', charityController.charityList);

router.get('/:id', charityController.charityDetails);

router.post('/create', charityController.Create);

router.post('/donate/:id', charityController.donate);

module.exports = router;