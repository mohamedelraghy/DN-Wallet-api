const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { User, validate } = require('../../models/user');
const cloudinaryUpload = require('../../services/cloudinary');
const formidable = require('formidable')

async function register (req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (formError, fields, files) => {
    if (formError) {
      console.error(formError);
      return res.status(400).json(formError);
    }
    req.body = fields;

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email : req.body.email });
    if(user) return res.status(400).json('User Already registered'); 
    
    user = new User(_.pick(req.body, ['name', 'email', 'password', 'country', 'phone']));
    if (files.photo) {
      const {secure_url, err} = await cloudinaryUpload(files.photo.path);
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      }
      user.photo = secure_url;
    }

    if(user.password !== req.body.confirm_password) return res.status(400).json("password doesn't match")
  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
   
    await user.save();
  
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).json({"user._id" : user._id});
  });
}

module.exports = register;