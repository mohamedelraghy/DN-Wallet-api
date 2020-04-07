const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');
const imgUpload = require('../middleware/multer');
const cloudinary = require('../onlineUpload');
const fs = require('fs');


router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
    
});

router.post('/register', imgUpload, async (req, res) => {


    // TODO: confirmation code sned via (email & Phone number) [ 😂️ الله المستعان]

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email : req.body.email });
    if(user){

        if(req.files[0]) fs.unlinkSync(req.files[0].path);
        return res.status(400).json(`User Already registered`); 
    } 
  
    user = new User(_.pick(req.body, ['name', 'email', 'password', 'country', 'phone']));
    if (req.files[0]) { 
        const picAttr = await cloudinary.uploads(req.files[0].path);
        user.photo = picAttr.url;
        fs.unlinkSync(req.files[0].path);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
   
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).json({"user._id" : user._id});
});

// router.put('/info',)

module.exports = router;