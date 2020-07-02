const { User } = require('../../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('joi');


async function checkCode(req, res){
   
    const user = await User.findOne({ email: req.body.email, resetCode: req.body.code, resetCodeExpiration: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ "error": "Invalid Code" });

    user.resetPassword = true;

    await user.save();

    return res.status(200).json(user);

}


module.exports = checkCode;