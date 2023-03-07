const { Bank, Validate } = require('../../models/bank');


async function chargeBank(req, res) {

    const { error } = Validate(req.body);
    if(error) return res.status(400).json({ "error": error.details[0].message });
    
    let bank = await Bank.findOne({ name: req.body.name });
    if(!bank) return res.status(400).json({ "error" : "Bank not found" });
    
    const found = bank.balance.find(balance => balance.currency_code == req.body.currency_code);
    
    if (!found) {
        const balance = {
            amount: req.body.amount,
            currency_code: req.body.currency_code
        }

        bank.balance.unshift(balance);
    } else {
        
        found.amount += req.body.amount;
    }

    await bank.save();
    return res.status(200).json({ "success": "balance added succusssfully" });
}

module.exports = chargeBank;