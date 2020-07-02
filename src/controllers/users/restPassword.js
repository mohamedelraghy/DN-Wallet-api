const { User } = require('../../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('joi');


async function restPassword(req, res) {

    const { error } = validate(req.body);
    if(error) return res.status(400).json({ "error": error.details[0].message });


    const user = await User.findOne({ email: req.body.email, restCode: req.body.code, restCodeExpiration: { $gt: Date.now(), restPassword: true } });
    if (!user) return res.status(400).json({ "error": "Invalid Code" });

   
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.restCode = undefined;
    user.restCodeExpiration = undefined;
    user.restPassword = undefined;

    await user.save();

    res.status(200);

}

function validate(req){
    const schmea = {
        email : Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    }
    return Joi.validate(req, schmea);
}

module.exports = restPassword;