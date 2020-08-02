const  express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const cardController = require('../controllers/card');

router.get('/', auth, cardController.cards); // card info for user

router.get('/:charityId', auth, cardController.cards); // card info for cahrity 

router.post('/', auth, cardController.createCard); // create card for user

router.post('/:charityID', auth, cardController.createCard); // create card for charity

router.post('/charge', auth, cardController.charge);

router.post('/transfer/:id', auth, cardController.transfer);


module.exports = router;