const { User } = require('../../models/user');
const { Card } = require('../../models/card'); 
const ObjectId = require('mongoose').Types.ObjectId;
const Joi = require('joi');


async function charge(req, res) {

    
    const { error } = validate(req.body);
    if(error) return res.status(400).json({ "error" : error.details[0].message});

    const amount = req.body.amount;
    const currency = req.body.currency_code;
    const acc = await User.findById(req.user._id)
        .populate("cards.cardID").select("cards cryptedAcc publicKey");
   
    const cardID = req.params.cardID;
    console.log(cardID);
    if (!ObjectId.isValid(cardID)) return res.status(400).json({ "error" : "Invalid ID"});

    const card = await Card.findById(cardID);
    
    // const found = card.balance.find(balance => balance.currency_code == req.body.currency_code);
    // if (!found) {
    //     const balance = {
    //         amount: req.body.amount,
    //         currency_code: req.body.currency_code
    //     }

    //     card.balance.unshift(balance);
    // } else {    
    //     found.amount += req.body.amount;
    // }

    // await card.save();

    
    return res.status(200).json(card);
}

function validate(req){
    const schema = {
        amount: Joi.number().required().positive(),
        currency_code: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY').required()
    }
    return Joi.validate(req, schema);
}

module.exports = charge;