const { Card } = require('../../models/card');
const { Bank } = require('../../models/bank');


async function charage(req, res) {

    const card = await Card.findOne({ cardHolder : req.user._id});
    console.log(card);
}

module.exports = charage;