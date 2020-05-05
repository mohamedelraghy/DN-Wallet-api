const express = require('express');
const router = express.Router();


const charityController = require('../controllers/charity')


router.get('/', async (req, res) => {
    const charity = await Charity.find();
    res.json(charity);
});

router.post('/create', charityController.Create);

module.exports = router;