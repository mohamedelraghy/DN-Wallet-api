const { User } = require('../../models/user');
const { Card } = require('../../models/card');
const ObjectId = require('mongoose').Types.ObjectId;
const Joi = require('joi');

async function withdraw(req, res) {

    const { error } = validate(req.body);
    if(error) res.status(400).json({ "error" : error.details[0].message });

    const amount = req.body.amount;
    const currency = req.body.currency_code;
    
    const user = await User.findById(req.user._id).select("cards cryptedAcc publicKey");
    if(!user) res.status(400).json({ "error" : "User not fount" });

    const cardID = req.params.cardID;
    if(!ObjectId.isValid(cardID)) return res.status(400).json({"error" : "Invalid ID"});

    const card = await Card.findById(cardID);
    if(!card) return res.status(400).json({ "error" : "card not found" });

    const found = card.balance.find(balance => balance.currency_code == currency);
    if(!found) {
        found.amount = amount;
        found.currency_code = currency;
    } else {
        found.amount += amount
    }

    card.save();

    return res.status(400).json({ "success" : "Transaction Done successfully" });
}

function validate(req) {

    const schema = {
        amount: Joi.number().required().positive(),
        currency_code: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY').required()
    }

    return Joi.validate(req, schema);
}

module.exports = withdraw;
