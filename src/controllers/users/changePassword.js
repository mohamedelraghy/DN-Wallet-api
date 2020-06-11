const { User } = require('../../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

async function chagePassword(req, res) {

    const { error } = validate(req.body);
    if(error) return res.status(400).json({ "error": error.details[0].message })

    const user = await User.findById(req.user._id);
    if(!user) return res.status(200).json({"error": "User with the Given ID is not found"});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(200).json({ "error": "Invalid Password" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);

    await user.save();

    return res.status(200).json({ "error": null });
}

function validate(req) {
    const schema = {
      password: Joi.string().min(8).max(255).required(),
      newPassword: Joi.string().min(8).max(255).required()
    }
    return Joi.validate(req, schema);
}

module.exports = chagePassword;