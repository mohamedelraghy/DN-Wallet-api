const mongoose = require('mongoose');
const Joi = require('joi');

const bankSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    balance : [{
        amount : Number,
        currency_code : {
            type : String,
            enum: ['EGP', 'USD', 'EUR', 'JPY', 'SAR', null],
            required : true
        }
    }]
});

const Bank = mongoose.model('Bank', bankSchema);

function validateBank(bank){
    const schema = {
        name : Joi.string().required(),
        amount : Joi.number().required().positive(),
        currency_code: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY', 'SAR').required()
    }

    return Joi.validate(bank, schema);
}

exports.Bank = Bank;
exports.Validate = validateBank;

export {};