const mongoose = require('mongoose');
const Joi = require('joi');

const cardSchema = new mongoose.Schema({
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
    }
});

const Card = mongoose.model('Card', cardSchema);


function validateCard(card) {
    const schema = {
        cardNumber: Joi.string().trim().regex(/^[0-9]+$/).length(16).require(),
        expMonth: Joi.string().regex(/^[0-9]+$/).length(2).required(),
        expYear: Joi.string().regex(/^[0-9]+$/).length(2).required(),
        cvc: Joi.string().regex(/^[0-9]+$/).length(3).required(),
        cardType: Joi.string()
    }
}

exports.Card = Card;
exports.Validate = validateCard;