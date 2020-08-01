const { Card } = require('../../models/card');
const { Bank } = require('../../models/bank');


async function charage(req, res) {

    const card = await Card.findOne({ cardHolder : req.user._id});
    const bank = await Bank.findOne({ name : "DN-Wallet" });
    
    if(!card) return res.status(400).json({ "error" : "User have no Card" });
    
    if(req.body.amount <= 0) return res.status(400).json({ "error" : "amount can't be 0 or negative number"});

    

}

module.exports = charage;