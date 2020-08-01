const mongoose = require('mongoose');
const Joi = require('joi');

const cardSchema = new mongoose.Schema({
    cardHolder : {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    cardNumber : {
        type : String,
        length : 16,
        unique : true,
        required : true 
    },
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
        type : String
    },
    balance : Number
});

const Card = mongoose.model('Card', cardSchema);


function validateCard(card) {
    const schema = {
        cardNumber: Joi.string().regex(/^[0-9]{16}$/).required(),
        expMonth: Joi.string().regex(/^[0-9]{16}$/).required(),
        expYear: Joi.string().regex(/^[0-9]{16}$/).required(),
        cvc: Joi.string().regex(/^[0-9]{3}$/).required(),
        cardType: Joi.string()
    }
    return Joi.validate(card, schema);
}

exports.Card = Card;
exports.Validate = validateCard;