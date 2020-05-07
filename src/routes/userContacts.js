const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const contactsController = require('../controllers/contacts');

router.get('/all', auth, contactsController.showAll);

router.post('/create/:id', auth, contactsController.Create);

module.exports = router;
