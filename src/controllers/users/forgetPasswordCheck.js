const { User } = require('../../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('joi');


async function checkCode(req, res){

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ "error": error.details[0].message });

    const user = await User.findOne({ email: req.body.email, resetCode: req.body.code, resetCodeExpiration: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ "error": "Invalid Code" });

    user.resetPassword = true;

    await user.save();

    return res.status(200).json(user);

}

function validate(req){
    const schema = {
        email : Joi.string().email().required(),
        code : Joi.string().min(4).max(4)
    }

    return Joi.validate(req, schema);
}

module.exports = checkCode;