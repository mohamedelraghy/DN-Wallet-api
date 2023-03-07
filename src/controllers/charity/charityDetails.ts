const { Charity } = require('../../models/charity_org');

async function charityDetails(req, res) {
    const charity = await Charity.findById(req.params.id).select('-_id');
    if(!charity) return res.status(400).json({ "error" : "Charity with the given ID is not found..." });
    res.status(200).json(charity);
}

module.exports = charityDetails;