const { Charity } = require('../../models/charity_org');

async function charityDetails(req, res) {
    const charity = await Charity.findById(req.params.id);
    res.json(charity);
}

module.exports = charityDetails;