const config = require('config');
const stripe = require('stripe')(config.get('stripeKey'));

async function retrieveBalance(req, res){

    stripe.balance.retrieve( (err, balance) =>{
        console.log(balance);
    });

}

module.exports = retrieveBalance;