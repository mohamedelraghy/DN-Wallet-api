const { User } = require('../../models/user');
const config = require('config');
const { strip } = require('joi');
const stripe = require('stripe')(config.get('stripeKey'));

async function createCard(req, res) {
    
    const customer = await User.findById(req.user._id).select('name stripeID');
    if(!customer) return res.status(400).json({ "error": "Customer not found" });

    const token = await stripe.tokens.create({
        card : {
            object: "card",
            number: req.body.cardNumber,
            exp_month: req.body.exp_month,
            exp_year: req.body.exp_year,
            cvc: req.body.cvc,
            name: customer.name
        }
    });

    if (!token) return res.status(400).json({ "error" : "cannot create a token" });
    
    const card = await stripe.customers.createSource(customer.stripeID, { source: token.id });
    if(!card) return res.status(400).json({ "error": "cannot create a card "});

    return res.status(200).json({ "success" : "card created successfully" });
}


module.exports = createCard;