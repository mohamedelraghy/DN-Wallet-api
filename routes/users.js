const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const imgUpload = require('../middleware/multer');
const cloudinary = require('../onlineUpload');
const fs = require('fs');


router.get('/me', async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user._id);
})

router.post('/', imgUpload, async (req, res) => {

    const picAttr = await cloudinary.uploads(req.files[0].path);

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email : req.body.email });
    if(user) return res.status(400).send(`User Already registered`); 

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'gender', 'phone', 'job']));
    user.photo = picAttr.url;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
   
    await user.save();

    fs.unlinkSync(req.files[0].path);

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;