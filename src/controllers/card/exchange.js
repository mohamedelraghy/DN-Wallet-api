const { User } = require('../../models/user');
const Joi = require('joi');


async function exchange(req, res) {

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ "error": error.details[0].message });

    const user = await User.findById(req.user._id)
        .populate("cards.cardID").select("cards cryptedAcc publicKey");

    if(!user) return res.status(400).json({ "error" : "User is not found" });

    const curr_from = req.body.curr_from;
    const curr_to = req.body.curr_to;
    const amount = req.body.amount;

    return res.status(200).json({ "success" : "exchange done successfully" });
}

function validate(req) {

    const schema = {
        curr_from: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY').required(),
        curr_to: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY').required(),
        amount: Joi.number().required().positive()
    }
    return Joi.validate(req, schema);
}

module.exports = exchange;

