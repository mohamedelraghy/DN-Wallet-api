const { Charity } = require('../../models/charity_org');

async function showAll (req, res) {
    const charity = await Charity.find().select('name email org_logo');
    res.status(200).json(charity);
}

module.exports = showAll;


export {};