const { Charity } = require('../../models/charity_org');
const ObjectId = require('mongoose').Types.ObjectId;

async function donate(req, res) {

    const id = req.params.id;
    if(!ObjectId.isValid(id)) return res.status(400).json({ "error": "InValid ID" });

    let chariy = await Charity.findById(id).select("publicKey");
    if(!chariy) return res.status(400).json({ "error": "Charity with the given ID not found" });

    const user = await User.findById(req.user._id).select('cryptedAcc publicKey email');
    if(!user) return res.status(400).json({ "error" : "user with the given ID is not found" });
    
    
    
    
    chariy.donation_number += 1;
   

    await chariy.save();
    res.status(200).json(chariy);
}

module.exports = donate;