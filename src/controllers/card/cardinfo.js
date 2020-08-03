const { User } = require('../../models/user');



async function getUserCards(req, res) {

    
    const cards = await User.findById(req.user._id)
        .populate("cards.cardID").select("cards");
    if(!cards) return res.status(400).json({ "error": "User don't have a card" });

    return res.status(200).json(cards);
}

module.exports = getUserCards;