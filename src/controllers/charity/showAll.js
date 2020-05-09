const { Charity } = require('../../models/charity_org');

async function showAll (req, res) {
    const charity = await Charity.find();
    res.json(charity);
}

module.exports = showAll;