const ObjectId = require('mongoose').Types.ObjectId;
const Joi = require('joi');
const { User } = require('../../models/user');


async function transfer(req, res) {

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ "error": error.details[0].message });

    const cardHolder = req.user._id;
    const transferTo = req.params.id;

    if (!ObjectId.isValid(transferTo)) return res.status(400).json({ "error": "Invaild ID" });
    
    if(cardHolder == transferTo) return res.status(400).json({ "error" : "you cannot transfer to your self" });

    const sender = await User.findById(cardHolder).select("cards cryptedAcc publicKey");
    const resiver = await User.findOne(transferTo).select("cards cryptedAcc publicKey");

    if(!sender || !resiver) return res.status(400).json({ "error" : "cannot send money" });

    const amount = req.body.amount;
    const currency = req.body.currency_code;

    // let found = senderCard.balance.find(balance => balance.currency_code == req.body.currency_code);
    // if (!found) {
    //     return res.status(400).json({ "error": "currency not avalible" });
    // } else {
    //     found.amount -= req.body.amount;
    // }

    // found = resiverCard.balance.find(balance => balance.currency_code == req.body.currency_code);
    // if (!found) {
    //     const balance = {
    //         amount: req.body.amount,
    //         currency_code: req.body.currency_code
    //     }
    //     resiverCard.balance.unshift(balance);
        
    // } else {
    //     found.amount += req.body.amount;
    // }

    // await senderCard.save();
    // await resiverCard.save();
    
    return res.status(200).json(card);
}

function validate(req) {
    const schema = {
        amount: Joi.number().required().positive(),
        currency_code: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY', 'SAR').required()
    }
    return Joi.validate(req, schema);
}

module.exports = transfer;