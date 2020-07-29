const { Card } = require('../../models/card');



async function getUserCards(req, res) {

    const cards = await Card.find({ cardHolder : req.user._id });
    if(cards.length == 0) return res.status(400).json({ "error": "User don't have a card" });

    return res.status(200).json(cards);
}

module.exports = getUserCards;