const { Card } = require('../../models/card');


async function transfer(req, res) {

    const cardHolder = req.user._id;
    const transferTo = req.pramas.id;

    const senderCard = await Card.findOne({ cardHolder : cardHolder });
    const resiverCard = await Card.findOne({ cardHolder : transferTo });

    if(!senderCard || !resiverCard) return res.status(400).json({ "error" : "cannot send money" });
}

module.exports = transfer;