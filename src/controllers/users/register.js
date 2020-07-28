const bcrypt = require('bcryptjs');
const config = require('config');
const _ = require('lodash');
const { User, validate } = require('../../models/user');

async function register (req, res) {
  
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ "error": error.details[0].message });

  let user = await User.findOne({ email : req.body.email });
  if(user) return res.status(400).json({ "error": "User Already registered" }); 

  

  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  if(user.password !== req.body.confirm_password) return res.status(400).json({ "error": "password doesn't match" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res.status(200).header('x-auth-token', token).json({ "token": token, "id": user._id });
  
}

module.exports = register;  