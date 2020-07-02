const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength: 5,
        maxlength: 50
    },
    email : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 255,
        unique : true
    },
    gender : {
        type : String,
        enum : ['Male', 'Female']
    },
    phone : {
        type : String,
        minlength : 11
    },
    password : {
        type : String,
        required : true,
        minlength : 8,
        maxlength : 1024
    },
    restCode: String,
    restCodeExpiration: Date,
    job : {
        type : String,
        minlength : 5,
        maxlength : 50
    },
    photo: { type : String },
    country : {type : String },
    userIsValidate : {
        type : Boolean
    },
    resetPassword : {
        type : Boolean
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id : this._id}, config.get('jwtKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        confirm_password: Joi.string().min(8).max(255).required(),
        gender : Joi.string().valid('Male', 'Female'),
        phone : Joi.string().min(11),
        job : Joi.string().min(5).max(50),
        photo : Joi.string(),
        country : Joi.string()
    };
    return Joi.validate(user, schema)
}

exports.User = User;
exports.validate = validateUser;