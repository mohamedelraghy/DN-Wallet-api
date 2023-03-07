const mongoose = require('mongoose');
const Joi = require('joi');

const charitySchema = new mongoose.Schema({
  org_logo: {
    type: String,
  },
  org_image: {
    type: String,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
    maxlength: 50,
  },
  founders: {
    type: String,
  },
  vision: {
    type: String,
  },
  about: {
    type: String,
  },
  email: {
    type: String,
    required:true
  },
  phone: {
    type: String,
    minlength: 11,
  },
  donation_number: {
    type: Number,
  },
  location: {
    lat: {
      type: Number,
    },
    lan: {
      type: Number,
    },
  },
  cards: [{
        cardID: {
            type: mongoose.Types.ObjectId,
            ref: "Card",
        }
  }],
  cryptedAcc : Object,
  publicKey : String
});

const Charity = mongoose.model('Charity', charitySchema);

function validateCharity(charity){
    const schema = {
        org_logo : Joi.string(),
        org_image : Joi.string(),
        name : Joi.string(),
        address : Joi.string().max(50),
        founders: Joi.string(),
        vision : Joi.string(),
        about : Joi.string(),
        email : Joi.string().email().required(),
        phone : Joi.string().min(11),
        donation_number: Joi.number(),
        amount : Joi.number(),
        lat : Joi.number(),
        lan : Joi.number()
    }
    return Joi.validate(charity, schema);
}

exports.Charity = Charity;
exports.validate = validateCharity;

export {};