const mongoose = require('mongoose');
const Joi = require('joi');

const bankSchema = new mongoose.Schema({
    name : String,
    balace : [{
        amount : Number,
        currency_code : {
            type : String,
            enum: ['EGP', 'USD', 'EUR', 'JPY', 'SAR', null],
        }
    }]
});

const Bank = mongoose.model('Bank', bankSchema);

function validateBank(bank){
    const schema = {
        amount : Joi.number().required(),
        currency_code: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY', 'SAR')
    }
    
}

exports.Bank = Bank;
exports.Validate = validateBank;