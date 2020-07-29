const { Card } = require('../../models/card');



async function getUserCards(req, res) {

    const cards = await Card.find({ cardHolder : req.user._id });
    res.satas(200).json(cards);
}

module.exports = getUserCards;