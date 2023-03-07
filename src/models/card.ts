const mongoose = require('mongoose');
const Joi = require('joi');

const cardSchema = new mongoose.Schema({
    cardNumber : {
        type : String,
        length : 16,
        unique : true,
        required : true 
    },
    last4Num : String,
    expMonth : {
        type : String,
        required : true,
        length : 2
    },
    expYear : {
        type : String,
        required : true,
        len : 2
    },
    cvc :{
        type : String,
        required : true,
        length : 3
    },
    cardType : {
        type : String,
        required : true,
        enum: ['visa', 'meza', 'mastercard', null],
    },
    balance: [{
        amount: Number,
        currency_code: {
            type: String,
            enum: ['EGP', 'USD', 'EUR', 'JPY', 'SAR', null],
            required: true
        }
    }]
});

const Card = mongoose.model('Card', cardSchema);


function validateCard(card) {
    const schema = {
        cardNumber: Joi.string().regex(/^[0-9]{16}$/).required(),
        expMonth: Joi.string().regex(/^[0-9]{2}$/).required(),
        expYear: Joi.string().regex(/^[0-9]{4}$/).required(),
        cvc: Joi.string().regex(/^[0-9]{3}$/).required(),
        cardType: Joi.string().required().valid('visa', 'meza', 'mastercard'),
    }
    return Joi.validate(card, schema);
}

exports.Card = Card;
exports.Validate = validateCard;