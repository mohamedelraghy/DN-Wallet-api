const config = require('config');
const stripe = require('stripe')(config.get('stripeKey'));
const { User } = require('../../models/user');

async function returiveCustomer(req, res) {

    const customer = await User.findById(req.user._id).select('stripeID');

    await stripe.customers.retrieve(
        customer.stripeID,
        (err, customers) =>{
            if(err){
                console.error(err);
                return res.status(400);
            }
            res.status(200).json(customers);
        }
    );
}

module.exports = returiveCustomer;