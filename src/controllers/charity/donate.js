const { Charity } = require('../../models/charity_org');
const ObjectId = require('mongoose').Types.ObjectId;

async function donate(req, res) {

    const id = req.params.id;
    if(!ObjectId.isValid(id)) return res.status(400).json('InValid ID');

    let chariy = await Charity.findById(id);
    if(!chariy) return res.status(400).json('Charity with the given ID not found');

    
    chariy.donation_number += 1;
    chariy.amount += req.body.amount;

    chariy.save();
    res.status(200).json(chariy);
}

module.exports = donate;