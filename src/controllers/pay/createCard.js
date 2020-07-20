const { User } = require('../../models/user');
const config = require('config');
const stripe = require('stripe')(config.get('stripeKey'));

async function createCard(req, res) {
    const customer = await User.findById(req.user._id).select('stripeID');
    

}

module.exports = createCard;