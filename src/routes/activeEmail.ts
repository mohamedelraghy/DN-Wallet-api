const express = require('express');
const router  = express.Router();

const auth = require('../middleware/auth');

const verficationController = require('../controllers/verfiy');

router.get('/', auth, verficationController.emailcode); // send activation key to email

router.post('/', auth, verficationController.checkActiveKey);

module.exports = router;
