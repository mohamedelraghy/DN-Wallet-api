const multer = require('multer');
const path = require("path");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');



const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './uplodas/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);

    const extname = fileTypes.test(path.extname(
        file.originalname).toLowerCase());

    if (mimetype && extname) return cb(null, true);

    cb("Error: File upload only supports the "
        + "following filetypes - " + filetypes);
}

const upload = multer({
    storage : storage,
    limits: {
        fileSize : 1024 * 1042 * 4
    },
    fileFilter : fileFilter
});


router.get('/me', async (req, res) => {
    //const user = await User.findById(req.user._id).select('-password');
    res.send(user._id);
})

router.post('/', async (req, res) => {
   
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email : req.body.email });
    if(user) return res.status(400).send(`User Already registered`); 

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'gender', 'phone', 'job']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    //user.photo =
    upload(req, res, function (err) {

        if (err) {

            // ERROR occured (here it can be occured due 
            // to uploading image of size greater than 
            // 1MB or uploading different file type) 
            res.send(err)
        }
        else {

            // SUCCESS, image successfully uploaded 
            res.send("Success, Image uploaded!")
        }
    }) 
    await user.save();
    return res.send(user)
});

module.exports = router;