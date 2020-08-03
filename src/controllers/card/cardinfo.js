const { User } = require('../../models/user');
const { Charity } = require("../../models/charity_org");
const ObjectId = require("mongoose").Types.ObjectId;


async function getUserCards(req, res) {

    const charityID = req.params.charityId;
    
    if(charityID){
        if (!ObjectId.isValid(charityID)) return res.status(400).json({ error: "Invaild ID" });

        const cards = await Charity.findById(charityID)
            .populate("cards.cardID").select("cards");
        if (!cards) return res.status(400).json({ error: "No charity with the given ID" });

        return res.status(200).json(cards);
    }

    const cards = await User.findById(req.user._id)
        .populate("cards.cardID").select("cards");
    if(!cards) return res.status(400).json({ "error": "User don't have a card" });

    return res.status(200).json(cards);
}

module.exports = getUserCards;