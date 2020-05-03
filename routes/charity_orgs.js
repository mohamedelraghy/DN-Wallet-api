const express = require('express');
const router = express.Router();
const { Charity, validate } = require('../models/charity_org');
const _ = require('lodash');
const imgUpload = require('../middleware/multer');
const cloudinary = require('../onlineUpload');


router.get('/', async (req, res) => {
    const charity = await Charity.find();
    res.json(charity);
});

router.post('/create', imgUpload, async (req, res) =>{

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let charity = new Charity(_.pick(req.body, ['name', 'address', 'founders', 'vision', 'about', 'email', 'phone']));
    
    if (req.files[0]) {
        const picAttr = await cloudinary.uploads(req.files[0].path);
        charity.org_logo = picAttr.url;
        fs.unlinkSync(req.files[0].path);
    }
    

    await charity.save()
    res.json(charity)

});

module.exports = router;