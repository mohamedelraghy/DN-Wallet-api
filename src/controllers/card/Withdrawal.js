const { User } = require('../../models/user');
const { Card } = require('../../models/card');
const ObjectId = require('mongoose').Types.ObjectId;
const Joi = require('joi');

async function withdraw(req, res) {

    const { error } = validate(req.body);
    if(erro) res.status(400).json({ "error" : error.details[0].message });
    
    const user = await User.findById(req.user._id);
    if(!user) res.status(400).json({ "error" : "User not fount" });


}

function validate(req) {

    const schema = {
        amount: Joi.number().required().positive(),
        currency_code: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY').required()
    }

    return Joi.validate(req, schema);
}

module.exports = withdraw;
