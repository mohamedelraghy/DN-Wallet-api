const { User } = require('../../models/user');


async function getUserCards(req, res) {

    const user = await User.findById(req.user._id)
      .populate("cards.cardID", "_id cardType last4Num")
      .select("cards -_id");
        
    if (!user) return res.status(400).json({ "error" : "user with the given ID is not found" });
    return res.status(200).json(user.cards);
}

module.exports = getUserCards;

export {}