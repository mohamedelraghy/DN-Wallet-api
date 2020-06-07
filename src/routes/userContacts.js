const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const contactsController = require('../controllers/contacts');

router.get('/', auth, contactsController.showAll);

router.post('/create/:id', auth, contactsController.Create);

router.delete('/delete/:id', auth, contactsController.Delete);

module.exports = router;
