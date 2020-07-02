const { User } = require('../../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('joi');


async function resetPassword(req, res) {

    const { error } = validate(req.body);
    if(error) return res.status(400).json({ "error": error.details[0].message });


    const user = await User.findOne({ email: req.body.email, resetCode: req.body.code, resetCodeExpiration: { $gt: Date.now() }, resetPassword: true });
    if (!user) return res.status(400).json({ "error": "Invalid Code" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetCode = undefined;
    user.resetCodeExpiration = undefined;
    user.resetPassword = undefined;

    await user.save();

    res.status(200).json();

}

function validate(req){
    const schmea = {
        email : Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        code : Joi.string().required()
    }
    return Joi.validate(req, schmea);
}

module.exports = resetPassword;