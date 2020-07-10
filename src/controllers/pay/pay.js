const config = require('config');
const stripe = require("stream")(config.get("stripeKey"));

async function pay(req, res) {

    stripe.charges.create(
      {
        amount: 2000,
        currency: "usd",
        source: "tok_visa",
        description: "My First Test Charge (created for API docs)",
      },
      function (err, charge) {
        console.log(charge);  
      }
    );

}

module.exports = pay;