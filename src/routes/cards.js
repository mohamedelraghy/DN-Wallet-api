const  express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const cardController = require('../controllers/card');

router.get('/', auth, cardController.cards); // card info for user

router.get('/balance', auth, cardController.getBalance);

router.get('/history', auth, cardController.history);

router.get('/balance/:charityID', cardController.getBalance);

router.post('/create', auth, cardController.createCard); // create card for user

router.post('/create/:charityID', auth, cardController.createCard); // create card for charity

router.post('/charge/:cardID', auth, cardController.charge);

router.post('/withdraw/:cardID', auth, cardController.withdraw);

router.post('/transfer/:id', auth, cardController.transfer);




module.exports = router;