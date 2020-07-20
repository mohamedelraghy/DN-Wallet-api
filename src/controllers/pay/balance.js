const { User } = require('../../models/user');
const config = require('config');
const stripe = require('stripe')(config.get('stripeKey'));

async function retrieveBalance(req, res){

    const user = await User.findById(req.user._id).select('-password');
    const balance = await stripe.balance.retrieve();

    console.log(balance);
}

module.exports = retrieveBalance;