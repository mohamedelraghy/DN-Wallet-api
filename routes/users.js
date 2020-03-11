const multer = require('multer');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);


    if (mimeType) return cb(null, true);

    cb("Error: File upload only supports the "
        + "following filetypes - " + filetypes);
}

const upload = multer({
    
    storage : storage,
    limits: {
        fileSize : 1024 * 1042 * 5
    },
    fileFilter : fileFilter
});


router.get('/me', async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user._id);
})

router.post('/', upload.single('photo'), async (req, res) => {
    console.log(req.file);
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email : req.body.email });
    if(user) return res.status(400).send(`User Already registered`); 

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'gender', 'phone', 'job']));
    user.photo = req.file.path;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
   
    await user.save();
    return res.send(user)
});

module.exports = router;