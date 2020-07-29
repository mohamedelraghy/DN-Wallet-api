const { Card, Validate } = require('../../models/card');
const _ = require('lodash');


async function createCard(req, res){

    const { error } = Validate(req.body);
    if (error) return res.status(400).json({ "error": error.details[0].message });

    let card = await Card.findOne({cardNumber : req.body.cardNumber });
    if(card) return res.status(400).json({ "error" : "failed to create card" });

    card = new Card(_.pick(req.body, ['cardNumber', 'expMonth', 'expYear', 'cvc', 'cardType']));
    card.cardHolder = req.user._id;
    card.balance = 0;
    
    await card.save();

}

module.exports = createCard;