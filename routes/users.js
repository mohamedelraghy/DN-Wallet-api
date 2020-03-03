const express = require('express');
const router = express.Router();

const { User, validate } = require('../models/user');

router.post('/', (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    
});

module.exports = router;