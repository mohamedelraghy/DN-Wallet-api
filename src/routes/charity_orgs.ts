const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


const charityController = require('../controllers/charity')

router.get('/', auth, charityController.charityList);

router.get('/:id', charityController.charityDetails);

router.post('/create', charityController.Create);

router.post('/donate/:id', auth, charityController.donate);

module.exports = router;

export {};