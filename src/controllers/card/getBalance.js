const { User } = require('../../models/user');
const { Charity } = require('../../models/charity_org');
const ObjectId = require('mongoose').Types.ObjectId;

async function getBalance (req, res) {

    const CharityID = req.params.cardID;
    if(CharityID){
        if (!ObjectId.isValid(CharityID)) return res.status(400).json({ "error": "Invalid ID" });
        
        const charity = await Charity.findById(CharityID).select('cards cryptedAcc publicKey');
        if(!charity) return res.status(400).json({ "error": "Charity with the given ID is not found" });

        
    }



    const user = await User.findById(req.user._id).select('cards cryptedAcc publicKey email');
    if(!user) return res.status(400).json({ "error" : "User with the Given ID is not found" });

}

module.exports = getBalance;