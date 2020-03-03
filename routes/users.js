const express = require('express');
const router = express.Router();

const { User, validate } = require('../models/user');

router.get('/', (req, res) => {
    const { error } = validate(req.body);
    console.log(error);

});

module.exports = router;