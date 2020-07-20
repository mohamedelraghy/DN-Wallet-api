const { User } = require('../../models/user');
const config = require('config');
const stripe = require('stripe')(config.get("stripeKey"));

async function charge(req, res) {

    const customer = await User.findOne({ email: req.body.email }).select('stripeID');

    const charge = await stripe.charges.create(
      {
        amount: 2000,
        currency: "usd",
        customer : customer.stripeID,
        description: "hello stripe (created for API docs)",
      });


      console.log(charge);

}

module.exports = charge;