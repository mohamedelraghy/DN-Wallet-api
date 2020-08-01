const  express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const cardController = require('../controllers/card');

router.get('/', auth, cardController.cards);

router.post('/', auth, cardController.createCard);

router.post('/charge', auth, cardController.charge);


module.exports = router;