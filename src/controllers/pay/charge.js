const config = require('config');
const stripe = require('stripe')(config.get("stripeKey"));

async function charge(req, res) {

    stripe.charges.create(
      {
        amount: 2000,
        currency: "usd",
        source: "tok_visa",
        description: "hello stripe (created for API docs)",
      },
      function (err, charge) {
        console.log('eerr',err)
        console.log(charge);  
      }
    );

}

module.exports = charge;