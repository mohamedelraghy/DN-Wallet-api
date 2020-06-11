const { User } = require('../../models/user');
const Joi = require('joi');
const bcrypt = require('bcryptjs');


async function login (req, res) {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ "error": error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ "error": "Invalid email or password." });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ "error": "Invalid email or password." });

    const token = user.generateAuthToken();
    res.json({ "token": token });
}

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = login;