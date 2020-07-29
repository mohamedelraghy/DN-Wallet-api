const { Card } = require('../../models/card');



async function getUserCards(req, res) {

    const cards = await Card.find({ cardHolder : req.user._id });
    return res.status(200).json(cards);
}

module.exports = getUserCards;