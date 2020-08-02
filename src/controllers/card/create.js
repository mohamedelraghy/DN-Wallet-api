const { Card, Validate } = require('../../models/card');
const { User } = require('../../models/user');
const { Charity } = require('../../models/charity_org');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');


async function createCard(req, res){

    const { error } = Validate(req.body);
    if (error) return res.status(400).json({ "error": error.details[0].message });

    let card = await Card.findOne({cardNumber : req.body.cardNumber });
    if(card) return res.status(400).json({ "error" : "failed to create card" });

    card = new Card(_.pick(req.body, ['cardNumber', 'expMonth', 'expYear', 'cvc', 'cardType']));
    
    const charityID = req.params.charityID;
    if (charityID) {
        if (!ObjectId.isValid(transferTo)) return res.status(400).json({ "error": "Invaild ID" });

        const charity = await Charity.findById(charityID);
        if(!charity) return res.status(400).json({ "error" : "No charity with the given ID" });
        
        charity.cardID = card._id;
        await card.save();
    }
    const user = await User.findById(req.user._id);
    user.cardID = card._id;

    await user.save();
    await card.save();

    return res.status(200).json(card);
    
}

module.exports = createCard;