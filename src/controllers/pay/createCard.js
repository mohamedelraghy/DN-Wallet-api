const { User } = require('../../models/user');
const config = require('config');
const stripe = require('stripe')(config.get('stripeKey'));

async function createCard(req, res) {

}

module.exports = createCard;