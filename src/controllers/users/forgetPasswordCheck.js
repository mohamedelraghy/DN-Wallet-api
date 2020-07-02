const { User } = require('../../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('joi');


async function checkCode(req, res){
   
    const user = await User.findOne({ email: req.body.email, restCode: req.body.code, restCodeExpiration: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ "error": "Invalid Code" });

    user.restPassword = true;

    return res.status(200).json({ user });

}

module.exports = checkCode;