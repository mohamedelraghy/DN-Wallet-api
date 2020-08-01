const { Bank, Validate } = require('../../models/bank');
const _ = require('lodash');

async function createBank(req, res) {

    const { error } = Validate(req.body);
    if (error) return res.status(400).json({ "error": error.details[0].message });

    let bank = await Bank.findOne({ bankName : req.body.bankName });
    if(bank) return res.status(400).json({ "error": "cannot create a bank" });

    bank = new Bank(_.pick(req.body, ['amount', 'currency_code']));

    await bank.save();

    return res.status(200).json(bank);
}

module.exports = createBank;