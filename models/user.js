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
        maxlength : 11
    },
    password : {
        type : String,
        required : true,
        minlength : 8,
        maxlength : 1024
    },
    job : {
        type : String,
        minlength : 5,
        maxlength : 50
    }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    };
    return Joi.validate(user, schema)
}

exports.User = User;
exports.validate = validateUser;