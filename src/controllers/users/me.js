const { User } = require('../../models/user');


async function Me (req, res){
    const user = await User.findById(req.user._id).select('-password');
    if(!user) return res.status(400).json({ "error": "user not found" });
    
    const balance = [ // amout : double , curr : code 
        {
            id: "asdlhgkfjasdgvkjjpo134421",
            amount : 500.50,
            currency : "EGP"
        },
        {
            id: "asdlhgkfjasdgvkjjpo134428",
            amount: 20.50,
            currency: "USD"
        }
    ]

    const crad = [
        {
            id : "asdlhgkfjasdgvkjjpo134423",
            name : "Visa",
            type : "perpaid",
            last4digits : "7894"
        }
    ]

    res.status(200).json({"user": user, "balance" : balance, "payment_cards" : crad });


}

module.exports = Me;